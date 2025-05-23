import { useEffect, useState } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Optional: Trigger any global callback
    window.frameworkReady?.();
    // Simulate hydration or wait for setup
    setReady(true);
  }, []);

  return ready;
}
