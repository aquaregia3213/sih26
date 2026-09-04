import { NetworkState, SyncResultSummary, PendingOfflineSession } from './offlineTypes';
import { OfflineStorageService } from './OfflineStorageService';

export class OfflineSyncService {
  private static currentState: NetworkState = 'ONLINE';
  private static listeners: Array<(state: NetworkState) => void> = [];

  public static initNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.currentState = navigator.onLine ? 'ONLINE' : 'OFFLINE';

    window.addEventListener('online', () => {
      this.setState('RECONNECTING');
      setTimeout(() => {
        this.syncPendingSessions();
      }, 1000);
    });

    window.addEventListener('offline', () => {
      this.setState('OFFLINE');
    });
  }

  public static getState(): NetworkState {
    return this.currentState;
  }

  public static setState(state: NetworkState): void {
    this.currentState = state;
    this.listeners.forEach((l) => l(state));
  }

  public static subscribeState(listener: (state: NetworkState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
    Synchronizes pending offline completed sessions with the backend server.
    IDEMPOTENT & RESILIENT: Preserves failed sessions for future retry; uses localSessionId for server deduplication.
   */
  public static async syncPendingSessions(authToken?: string): Promise<SyncResultSummary> {
    const pending = await OfflineStorageService.getPendingSessions();

    if (pending.length === 0) {
      this.setState(navigator.onLine ? 'ONLINE' : 'OFFLINE');
      return {
        totalPending: 0,
        syncedCount: 0,
        failedCount: 0,
        timestamp: new Date().toISOString(),
      };
    }

    this.setState('SYNCING');
    let syncedCount = 0;
    let failedCount = 0;

    for (const session of pending) {
      try {
        const success = await this.sendSessionToServer(session, authToken);
        if (success) {
          await OfflineStorageService.markSessionSynced(session.localSessionId);
          syncedCount++;
        } else {
          session.status = 'FAILED_RETRYABLE';
          failedCount++;
        }
      } catch (err: any) {
        session.status = 'FAILED_RETRYABLE';
        session.syncError = err.message || 'Sync network error';
        failedCount++;
      }
    }

    await OfflineStorageService.removeSyncedSessions();
    this.setState(navigator.onLine ? 'ONLINE' : 'OFFLINE');

    return {
      totalPending: pending.length,
      syncedCount,
      failedCount,
      timestamp: new Date().toISOString(),
    };
  }

  private static async sendSessionToServer(session: PendingOfflineSession, authToken?: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch('/api/sync', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          queue: [
            {
              localSessionId: session.localSessionId,
              gameId: session.gameId,
              scoreObtained: session.scoreObtained,
              totalPossibleScore: session.totalPossibleScore,
              accuracyPercentage: session.accuracyPercentage,
              completedAt: session.completedAt,
            },
          ],
          patientId: session.userId,
          clientTimestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) return false;
      const data = await response.json();
      return data.status === 'synced' || data.success === true;
    } catch {
      return false;
    }
  }
}
