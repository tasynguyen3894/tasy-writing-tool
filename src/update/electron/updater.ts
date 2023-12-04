import { AppUpdater, UpdateCheckResult } from 'electron-updater';

export interface Updater {
  downloadUpdates(): Promise<UpdateCheckResult | null>
  checkForUpdates(): Promise<UpdateCheckResult | null>
}

export function createUpdater(autoUpdater: AppUpdater): Updater {
  function checkForUpdates() {
    return autoUpdater.checkForUpdates();
  }
  
  function downloadUpdates() {
    return autoUpdater.checkForUpdates();
  }

  return {
    downloadUpdates,
    checkForUpdates
  }
}
