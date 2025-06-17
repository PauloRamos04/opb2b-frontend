'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Spreadsheet from '@/components/Spreadsheet';
import { SpreadsheetProvider } from '@/contexts/SpreadsheetContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Home() {
  return (
    <ThemeProvider>
      <SpreadsheetProvider>
        <Layout>
          <Spreadsheet />
        </Layout>
      </SpreadsheetProvider>
    </ThemeProvider>
  );
}