import React from 'react';
import { Search, Eye, EyeOff, Download, Upload } from 'lucide-react';

interface FiltersPanelProps {
  mostrarFiltros: boolean;
  filtrosAvancados: any;
  setFiltrosAvancados: (filtros: any) => void;
  valoresUnicos: {
    operadores: string[];
    status: string[];
    carteiras: string[];
  };
  colunasVisiveis: any;
  setColunasVisiveis: (colunas: any) => void;
  limparFiltros: () => void;
  darkMode: boolean;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  mostrarFiltros,
  filtrosAvancados,
  setFiltrosAvancados,
  valoresUnicos,
  colunasVisiveis,
  setColunasVisiveis,
  limparFiltros,
  darkMode
}) => {
  if (!mostrarFiltros) return null;

  return (
    <div className={`border rounded-lg p-4 mb-6 ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Busca Geral
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar em todos os campos..."
              value={filtrosAvancados.buscaGeral}
              onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, buscaGeral: e.target.value }))}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
            />
          </div>
        </div>

        {/**Operador */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Operador
          </label>
          <select
            value={filtrosAvancados.operador}
            onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, operador: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
          >
            <option value="">Todos os operadores</option>
            {valoresUnicos.operadores.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>

        {/*status */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Status
          </label>
          <select
            value={filtrosAvancados.status}
            onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, status: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
          >
            <option value="">Todos os status</option>
            {valoresUnicos.status.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/**Carteira */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Carteira
          </label>
          <select
            value={filtrosAvancados.carteira}
            onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, carteira: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
              ? 'bg-gray-600 border-gray-500 text-white'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
          >
            <option value="">Todas as carteiras</option>
            {valoresUnicos.carteiras.map((carteira) => (
              <option key={carteira} value={carteira}>{carteira}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Colunas Visíveis
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.entries(colunasVisiveis).map(([coluna, visivel]) => (
            <label key={coluna} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={visivel as boolean}
                onChange={(e) => setColunasVisiveis((prev: any) => ({ ...prev, [coluna]: e.target.checked }))}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className={`truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{coluna}</span>
              {visivel ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={limparFiltros}
          className={`text-sm hover:underline ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
        >
          Limpar todos os filtros
        </button>

        <div className="flex space-x-2">
          <button className={`flex items-center space-x-2 px-3 py-1 text-sm rounded hover:bg-opacity-80 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'
            }`}>
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button className={`flex items-center space-x-2 px-3 py-1 text-sm rounded hover:bg-opacity-80 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'
            }`}>
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;