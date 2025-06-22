'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Spreadsheet from '@/components/Spreadsheet';
import { SpreadsheetProvider } from '@/contexts/SpreadsheetContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProtectedRoute>
          <ThemeProvider>
            <SpreadsheetProvider>
              <Layout>
                <Spreadsheet />
              </Layout>
            </SpreadsheetProvider>
          </ThemeProvider>
        </ProtectedRoute>
      </AuthProvider>
    </ErrorBoundary>
  );
}