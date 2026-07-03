import { useCallback } from 'react';
import { API_BASE_URL } from '../services/api';

export function useOAuth() {
  const openOAuth = useCallback((provider: string) => {
    return new Promise<{ token?: string; user?: any }>((resolve, reject) => {
      const redirectUri = `${window.location.origin}/oauth-callback.html`;
      const url = `${API_BASE_URL}/auth/oauth/${provider}?redirect_uri=${encodeURIComponent(
        redirectUri,
      )}`;

      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        url,
        'oauth',
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!popup) {
        reject(new Error('Unable to open authentication window'));
        return;
      }

      const listener = (e: MessageEvent) => {
        // Accept messages only from same origin
        if (e.origin !== window.location.origin) return;
        const data = e.data as any;
        if (data?.type !== 'oauth' || data?.provider !== provider) return;
        window.removeEventListener('message', listener);
        try {
          if (data.error) reject(new Error(data.error));
          else resolve(data.payload || {});
        } finally {
          try {
            popup.close();
          } catch {}
        }
      };

      window.addEventListener('message', listener);

      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          window.removeEventListener('message', listener);
          reject(new Error('Authentication window was closed'));
        }
      }, 500);
    });
  }, []);

  return { openOAuth };
}

export default useOAuth;
