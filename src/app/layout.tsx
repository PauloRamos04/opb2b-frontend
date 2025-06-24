import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NotificationsProvider } from '@/components/common/NotificationsProvider';
import { SpreadsheetProvider } from '@/contexts/SpreadsheetContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OPB2B - Sistema de Operações B2B',
  description: 'Sistema de gestão de chamados e operações B2B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <SpreadsheetProvider>
              {children}
            </SpreadsheetProvider>
          </AuthProvider>
          <NotificationsProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}