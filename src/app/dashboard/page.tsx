import React from 'react';
import Layout from '@/components/Layout';
import Spreadsheet from '@/components/Spreadsheet';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <Layout>
          <Spreadsheet />
        </Layout>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}