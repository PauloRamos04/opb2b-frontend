import React from 'react';
import { X, User } from 'lucide-react';

interface OperadorFilterProps {
  operadorList: string[];
  selectedOperadores: string[];
  adicionarFiltroOperador: (operador: string) => void;
  removerFiltroOperador: (operador: string) => void;
  darkMode: boolean;
}

const OperadorFilter: React.FC<OperadorFilterProps> = ({
  operadorList,
  selectedOperadores,
  adicionarFiltroOperador,
  removerFiltroOperador,
  darkMode
}) => (
  <div>
    <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-50' : 'text-gray-900'}`}>
      <User className="w-4 h-4 inline mr-2" />
      Operadores
    </label>
    <div className="space-y-2">
      <select
        onChange={(e) => {
          if (e.target.value) {
            adicionarFiltroOperador(e.target.value);
            e.target.value = '';
          }
        }}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-white border-gray-300 text-gray-900'
          }`}
      >
        <option value="">Adicionar Operador...</option>
        {operadorList.filter(c => !selectedOperadores.includes(c)).map(operador => (
          <option key={operador} value={operador}>{operador}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {selectedOperadores.map(operador => (
          <span
            key={operador}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
          >
            {operador}
            <button
              onClick={() => removerFiltroOperador(operador)}
              className="ml-1 hover:text-purple-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default OperadorFilter; 