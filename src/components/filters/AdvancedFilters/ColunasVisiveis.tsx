import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ColunasVisiveisProps {
  colunasVisiveis: Record<string, boolean>;
  setColunasVisiveis: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleAllColumns: (visible: boolean) => void;
  darkMode: boolean;
}

const ColunasVisiveis: React.FC<ColunasVisiveisProps> = ({
  colunasVisiveis,
  setColunasVisiveis,
  toggleAllColumns,
  darkMode
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h4 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Configurar Colunas Visíveis</h4>
      <div className="flex space-x-2">
        <button
          onClick={() => toggleAllColumns(true)}
          className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          Mostrar Todas
        </button>
        <button
          onClick={() => toggleAllColumns(false)}
          className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Ocultar Todas
        </button>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Object.entries(colunasVisiveis).map(([coluna, visivel]) => (
        <label key={coluna} className={`flex items-center space-x-3 cursor-pointer p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
          <input
            type="checkbox"
            checked={visivel}
            onChange={(e) => setColunasVisiveis(prev => ({ ...prev, [coluna]: e.target.checked }))}
            className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
          />
          <span className={`text-sm flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{coluna}</span>
          {visivel ? (
            <Eye className="w-4 h-4 text-green-500" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </label>
      ))}
    </div>
  </div>
);

export default ColunasVisiveis; 