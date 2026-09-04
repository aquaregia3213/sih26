import { useState, useEffect } from 'react';
import { NetworkState } from './offlineTypes';
import { OfflineSyncService } from './OfflineSyncService';
import { OfflineStorageService } from './OfflineStorageService';

export function useOfflineStatus() {
  const [networkState, setNetworkState] = useState<NetworkState>(OfflineSyncService.getState());
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    OfflineSyncService.initNetworkMonitoring();

    const checkPending = async () => {
      const pending = await OfflineStorageService.getPendingSessions();
      setPendingCount(pending.length);
    };

    checkPending();

    const unsubscribe = OfflineSyncService.subscribeState((state) => {
      setNetworkState(state);
      checkPending();
    });

    return unsubscribe;
  }, []);

  const triggerSync = async (authToken?: string) => {
    return OfflineSyncService.syncPendingSessions(authToken);
  };

  return {
    networkState,
    isOnline: networkState === 'ONLINE',
    isOffline: networkState === 'OFFLINE',
    isSyncing: networkState === 'SYNCING',
    pendingCount,
    triggerSync,
  };
}
