import { useEffect } from 'react';

export function useCanduServiceActivation() {
  useEffect(() => {
    let script: HTMLScriptElement | undefined;

    if (import.meta.env.VITE_ENV !== 'dev') {
      script = document.createElement('script');
      script.src = 'https://cdn.candu.ai/sdk/latest/candu.umd.js';
      script.onload = () => {
        window.Candu.init({ clientToken: 'CKf5ldkAW0' });
      };
      document.body.appendChild(script);
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);
}
