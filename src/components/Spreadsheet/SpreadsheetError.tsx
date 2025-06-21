import React from 'react';
import { X } from 'lucide-react';

interface SpreadsheetErrorProps {
  error: string;
  darkMode: boolean;
  refreshData: () => void;
}

const SpreadsheetError: React.FC<SpreadsheetErrorProps> = ({ error, darkMode, refreshData }) => (
  <div className={`${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
    <div className="flex items-center">
      <X className="w-5 h-5 text-red-500 mr-2" />
      <span className={darkMode ? 'text-red-300' : 'text-red-700'}>Erro: {error}</span>
    </div>
    <button
      onClick={refreshData}
      className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Tentar novamente
    </button>
  </div>
);

export default SpreadsheetError; 