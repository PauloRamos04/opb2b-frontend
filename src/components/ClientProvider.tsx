'use client';

import { useEffect } from 'react';
import { setupAuthInterceptor } from '@/utils/auth-interceptor';
import { setupStorageMonitor } from '@/utils/storage-monitor';

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  useEffect(() => {
    setupStorageMonitor();
    setupAuthInterceptor();
  }, []);

  return <>{children}</>;
}