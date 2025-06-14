'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Spreadsheet from '@/components/Spreadsheet';
import { SpreadsheetProvider } from '@/contexts/SpreadsheetContext';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <SpreadsheetProvider>
      <Layout>
        <Spreadsheet />
      </Layout>
      <Toaster position="bottom-right" />
    </SpreadsheetProvider>
  );
}