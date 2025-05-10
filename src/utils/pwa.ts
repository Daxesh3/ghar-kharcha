import { registerSW } from 'virtual:pwa-register';

export const registerSW = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const updateSW = registerSW({
        onNeedRefresh() {
          const shouldRefresh = window.confirm(
            'New content available. Reload to update?'
          );
          if (shouldRefresh) {
            updateSW(true);
          }
        },
        onOfflineReady() {
          console.log('App ready to work offline');
        },
      });
      
      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return false;
    }
  }
  
  return false;
};