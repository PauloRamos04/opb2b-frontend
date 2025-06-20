'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';

function RedirectComponent() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecionando para login...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <RedirectComponent />
    </AuthProvider>
  );
}