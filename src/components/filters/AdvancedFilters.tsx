'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Filter,
  X,
  Search,
  Eye,
  EyeOff,
  ChevronDown,
  Download,
  Calendar,
  Clock,
  User,
  Building,
  Tag,
  Settings,
  RotateCcw,
  Bookmark,
  ChevronUp
} from 'lucide-react';
import { CARTEIRAS_LIST, STATUS_LIST, OPERADOR_LIST } from '@/constants';
import { FilterState } from '@/types';
import { INITIAL_FILTER_STATE } from '@/config';
import StatusFilter from './AdvancedFilters/StatusFilter';
import CarteiraFilter from './AdvancedFilters/CarteiraFilter';
import OperadorFilter from './AdvancedFilters/OperadorFilter';
import AdvancedFields from './AdvancedFilters/AdvancedFields';
import ColunasVisiveis from './AdvancedFilters/ColunasVisiveis';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';

interface AdvancedFiltersProps {
  filtrosAvancados: FilterState;
  setFiltrosAvancados: React.Dispatch<React.SetStateAction<FilterState>>;
  colunasVisiveis: Record<string, boolean>;
  setColunasVisiveis: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  mostrarFiltros: boolean;
  setMostrarFiltros: React.Dispatch<React.SetStateAction<boolean>>;
  valoresUnicos: {
    operadores: string[];
    servico: string[];
    status: string[];
    carteiras: string[];
    cidades: string[];
    tecnicos: string[];
    clientes: string[];
    ufs: string[];
    regionais: string[];
    responsaveis: string[];
  };
  filteredDataLength: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filtrosAvancados,
  setFiltrosAvancados,
  colunasVisiveis,
  setColunasVisiveis,
  mostrarFiltros,
  setMostrarFiltros,
  valoresUnicos,
  filteredDataLength
}) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'basico' | 'colunas'>('basico');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Usar o hook para lógica de filtros
  const {
    limparFiltros,
    adicionarFiltroStatus,
    removerFiltroStatus,
    adicionarFiltroCarteira,
    removerFiltroCarteira,
    adicionarFiltroOperador,
    removerFiltroOperador,
    toggleAllColumns,
    filtrosAtivosCount,
    colunasVisiveisCount
  } = useAdvancedFilters({ filtrosAvancados, setFiltrosAvancados, colunasVisiveis, setColunasVisiveis });

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${mostrarFiltros
          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
          : darkMode
            ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {filtrosAtivosCount > 0 && (
          <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {filtrosAtivosCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
      </button>

      {mostrarFiltros && (
        <div className={`absolute top-full right-0 mt-2 border rounded-lg shadow-xl z-50 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}
          style={{
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            width: '750px',
            minWidth: '400px',
            maxWidth: 'calc(100vw - 32px)'
          }}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-1">
                {[
                  { id: 'basico', label: 'Filtros', icon: Search },
                  { id: 'colunas', label: 'Colunas', icon: Eye }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === id
                      ? darkMode
                        ? 'bg-indigo-900 text-indigo-300 border border-indigo-700'
                        : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setMostrarFiltros(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'basico' && (
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-50' : 'text-gray-700'}`}>
                    <Search className="w-4 h-4 inline mr-2" />
                    Busca Geral
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar em todos os campos..."
                      value={filtrosAvancados.buscaGeral}
                      onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, buscaGeral: e.target.value }))}
                      className={`pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatusFilter
                    statusList={STATUS_LIST}
                    selectedStatus={filtrosAvancados.status}
                    adicionarFiltroStatus={adicionarFiltroStatus}
                    removerFiltroStatus={removerFiltroStatus}
                    darkMode={darkMode}
                  />
                  <CarteiraFilter
                    carteiraList={CARTEIRAS_LIST}
                    selectedCarteiras={filtrosAvancados.carteira}
                    adicionarFiltroCarteira={adicionarFiltroCarteira}
                    removerFiltroCarteira={removerFiltroCarteira}
                    darkMode={darkMode}
                  />
                  <OperadorFilter
                    operadorList={OPERADOR_LIST}
                    selectedOperadores={filtrosAvancados.operador}
                    adicionarFiltroOperador={adicionarFiltroOperador}
                    removerFiltroOperador={removerFiltroOperador}
                    darkMode={darkMode}
                  />
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${showAdvanced
                      ? darkMode
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-700'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Filtros Avançados</span>
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={limparFiltros}
                      className={`flex items-center space-x-2 text-sm hover:underline ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Limpar Filtros</span>
                    </button>

                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>

                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {filtrosAtivosCount} filtros ativos
                    </span>

                    <button
                      className={`flex items-center space-x-2 px-3 py-2 text-sm rounded hover:bg-opacity-80 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>Exportar Dados</span>
                    </button>
                  </div>
                </div>

                {showAdvanced && (
                  <AdvancedFields
                    filtrosAvancados={filtrosAvancados}
                    setFiltrosAvancados={setFiltrosAvancados}
                    valoresUnicos={valoresUnicos}
                    darkMode={darkMode}
                  />
                )}
              </div>
            )}

            {activeTab === 'colunas' && (
              <ColunasVisiveis
                colunasVisiveis={colunasVisiveis}
                setColunasVisiveis={setColunasVisiveis}
                toggleAllColumns={toggleAllColumns}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;