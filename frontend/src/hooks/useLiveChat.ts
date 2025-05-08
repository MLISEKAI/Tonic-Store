import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export function useLiveChat(tawkToId: string) {
  useEffect(() => {
    // Add Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkToId}/default`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);

    // Initialize Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    return () => {
      // Cleanup script on component unmount
      document.head.removeChild(script);
    };
  }, [tawkToId]);

  return {
    Tawk_API: window.Tawk_API
  };
} 