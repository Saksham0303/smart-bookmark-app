"use client";

import { useEffect, useState } from 'react';

export function usePageVisibility() {
  const [visible, setVisible] = useState(typeof document !== 'undefined' ? !document.hidden : true);

  useEffect(() => {
    const handle = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handle, false);
    return () => document.removeEventListener('visibilitychange', handle, false);
  }, []);

  return visible;
}
