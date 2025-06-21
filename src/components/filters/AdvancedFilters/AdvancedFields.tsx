import React from 'react';
import { User, Building, Clock, Calendar } from 'lucide-react';

interface AdvancedFieldsProps {
  filtrosAvancados: any;
  setFiltrosAvancados: (cb: any) => void;
  valoresUnicos: {
    cidades: string[];
  };
  darkMode: boolean;
}

const AdvancedFields: React.FC<AdvancedFieldsProps> = ({
  filtrosAvancados,
  setFiltrosAvancados,
  valoresUnicos,
  darkMode
}) => (
  <div className="mt-4 p-4 rounded-lg space-y-4" style={{ background: darkMode ? '#111827' : '#f9fafb' }}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-50' : 'text-gray-700'}`}>
          <User className="w-4 h-4 inline mr-2" />
          Técnico
        </label>
        <input
          type="text"
          placeholder="Filtrar por técnico..."
          value={filtrosAvancados.tecnico}
          onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, tecnico: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900'
            }`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-50' : 'text-gray-700'}`}>
          <Building className="w-4 h-4 inline mr-2" />
          Cliente
        </label>
        <input
          type="text"
          placeholder="Nome do cliente..."
          value={filtrosAvancados.cliente}
          onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, cliente: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900'
            }`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-50' : 'text-gray-700'}`}>
          Cidade
        </label>
        <select
          value={filtrosAvancados.cidade}
          onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, cidade: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900'
            }`}
        >
          <option value="">Todas as cidades</option>
          {valoresUnicos.cidades?.map((cidades: string) => (
            <option key={cidades} value={cidades}>{cidades}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-50' : 'text-gray-700'}`}>
          <Clock className="w-4 h-4 inline mr-2" />
          Tem Retorno
        </label>
        <select
          value={filtrosAvancados.temRetorno}
          onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, temRetorno: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'
            }`}
        >
          <option value="">Todos</option>
          <option value="sim">Com retorno</option>
          <option value="nao">Sem retorno</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-50' : 'text-gray-700'}`}>
          <Calendar className="w-4 h-4 inline mr-2" />
          Data Início
        </label>
        <input
          type="date"
          value={filtrosAvancados.dataInicio}
          onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, dataInicio: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'
            }`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-50' : 'text-gray-700'}`}>
          <Calendar className="w-4 h-4 inline mr-2" />
          Data Fim
        </label>
        <input
          type="date"
          value={filtrosAvancados.dataFim}
          onChange={(e) => setFiltrosAvancados((prev: any) => ({ ...prev, dataFim: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'
            }`}
        />
      </div>
    </div>
  </div>
);

export default AdvancedFields; 