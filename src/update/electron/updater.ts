import { AppUpdater, UpdateCheckResult } from 'electron-updater';

export interface Updater {
  downloadUpdates(): Promise<string[]>
  checkForUpdates(): Promise<UpdateCheckResult | null>
  quitAndInstall(): void
}

export function createUpdater(autoUpdater: AppUpdater): Updater {
  function checkForUpdates() {
    return autoUpdater.checkForUpdates();
  }
  
  function downloadUpdates() {
    return autoUpdater.downloadUpdate();
  }

  function quitAndInstall() {
    return autoUpdater.quitAndInstall();
  }

  return {
    downloadUpdates,
    checkForUpdates,
    quitAndInstall
  }
}
