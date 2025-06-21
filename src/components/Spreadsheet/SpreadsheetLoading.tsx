import React from 'react';
import { RefreshCw } from 'lucide-react';

interface SpreadsheetLoadingProps {
  darkMode: boolean;
}

const SpreadsheetLoading: React.FC<SpreadsheetLoadingProps> = ({ darkMode }) => (
  <div className={`flex items-center justify-center h-64 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
    <span className="ml-2">Carregando dados...</span>
  </div>
);

export default SpreadsheetLoading; 