import { CachedGameContent, PendingOfflineSession } from './offlineTypes';

export class OfflineStorageService {
  private static DB_NAME = 'VanikaOfflineDB';
  private static DB_VERSION = 1;
  private static db: IDBDatabase | null = null;
  private static memoryGamesStore: Map<string, CachedGameContent> = new Map();
  private static memorySessionsStore: Map<string, PendingOfflineSession> = new Map();

  /**
    Initializes IndexedDB with object stores for games and pending sessions.
   */
  public static async initDB(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return; // Uses in-memory fallback if IndexedDB is unsupported
    }

    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('cached_games')) {
            db.createObjectStore('cached_games', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('pending_sessions')) {
            db.createObjectStore('pending_sessions', { keyPath: 'localSessionId' });
          }
        };

        request.onsuccess = (event: any) => {
          this.db = event.target.result;
          resolve();
        };

        request.onerror = (event: any) => {
          console.warn('[OfflineStorage] IndexedDB open error, using in-memory storage fallback:', event.target.error);
          resolve();
        };
      } catch {
        resolve();
      }
    });
  }

  /**
    Caches playable game content for offline play.
   */
  public static async cacheGameContent(game: CachedGameContent): Promise<void> {
    this.memoryGamesStore.set(game.id, game);

    if (this.db) {
      try {
        const tx = this.db.transaction('cached_games', 'readwrite');
        tx.objectStore('cached_games').put(game);
      } catch {}
    }
  }

  /**
    Retrieves all offline-available cached games.
   */
  public static async getCachedGames(): Promise<CachedGameContent[]> {
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db!.transaction('cached_games', 'readonly');
          const store = tx.objectStore('cached_games');
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve(Array.from(this.memoryGamesStore.values()));
        } catch {
          resolve(Array.from(this.memoryGamesStore.values()));
        }
      });
    }
    return Array.from(this.memoryGamesStore.values());
  }

  /**
    Checks if a specific game is cached for offline play.
   */
  public static async isGameCached(gameId: string): Promise<boolean> {
    if (this.memoryGamesStore.has(gameId)) return true;
    const games = await this.getCachedGames();
    return games.some((g) => g.id === gameId || g.slug === gameId);
  }

  /**
    Saves completed offline game session marked PENDING_SYNC.
    SECURITY CONTROL: Stores zero passwords, hashes, or JWT credentials!
   */
  public static async savePendingSession(session: PendingOfflineSession): Promise<void> {
    this.memorySessionsStore.set(session.localSessionId, session);

    if (this.db) {
      try {
        const tx = this.db.transaction('pending_sessions', 'readwrite');
        tx.objectStore('pending_sessions').put(session);
      } catch {}
    }
  }

  /**
    Retrieves all pending offline sessions waiting for synchronization.
   */
  public static async getPendingSessions(): Promise<PendingOfflineSession[]> {
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db!.transaction('pending_sessions', 'readonly');
          const store = tx.objectStore('pending_sessions');
          const request = store.getAll();
          request.onsuccess = () => {
            const list: PendingOfflineSession[] = request.result || [];
            resolve(list.filter((s) => s.status === 'PENDING_SYNC' || s.status === 'FAILED_RETRYABLE'));
          };
          request.onerror = () => {
            const memoryList = Array.from(this.memorySessionsStore.values());
            resolve(memoryList.filter((s) => s.status === 'PENDING_SYNC' || s.status === 'FAILED_RETRYABLE'));
          };
        } catch {
          const memoryList = Array.from(this.memorySessionsStore.values());
          resolve(memoryList.filter((s) => s.status === 'PENDING_SYNC' || s.status === 'FAILED_RETRYABLE'));
        }
      });
    }
    const memoryList = Array.from(this.memorySessionsStore.values());
    return memoryList.filter((s) => s.status === 'PENDING_SYNC' || s.status === 'FAILED_RETRYABLE');
  }

  /**
    Marks session as SYNCED after server confirms synchronization.
   */
  public static async markSessionSynced(localSessionId: string): Promise<void> {
    const memSession = this.memorySessionsStore.get(localSessionId);
    if (memSession) {
      memSession.status = 'SYNCED';
    }

    if (this.db) {
      try {
        const tx = this.db.transaction('pending_sessions', 'readwrite');
        const store = tx.objectStore('pending_sessions');
        const getReq = store.get(localSessionId);
        getReq.onsuccess = () => {
          if (getReq.result) {
            getReq.result.status = 'SYNCED';
            store.put(getReq.result);
          }
        };
      } catch {}
    }
  }

  /**
    Cleans up synced sessions.
   */
  public static async removeSyncedSessions(): Promise<void> {
    for (const [key, session] of this.memorySessionsStore.entries()) {
      if (session.status === 'SYNCED') {
        this.memorySessionsStore.delete(key);
      }
    }
  }
}
