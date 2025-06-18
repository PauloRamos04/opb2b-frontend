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
import { CARTEIRAS_LIST, STATUS_LIST, INITIAL_FILTER_STATE, OPERADOR_LIST } from '@/constants/spreadsheet';
import { FilterState } from '@/types/filters';

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

  const limparFiltros = () => {
    setFiltrosAvancados({
      ...INITIAL_FILTER_STATE,
      status: [],
      carteira: [],
      operador: [],
      tags: []
    });
  };

  const adicionarFiltroStatus = (status: string) => {
    if (!filtrosAvancados.status.includes(status)) {
      setFiltrosAvancados(prev => ({
        ...prev,
        status: [...prev.status, status]
      }));
    }
  };

  const removerFiltroStatus = (status: string) => {
    setFiltrosAvancados(prev => ({
      ...prev,
      status: prev.status.filter(s => s !== status)
    }));
  };

  const adicionarFiltroCarteira = (carteira: string) => {
    if (!filtrosAvancados.carteira.includes(carteira)) {
      setFiltrosAvancados(prev => ({
        ...prev,
        carteira: [...prev.carteira, carteira]
      }));
    }
  };

  const removerFiltroCarteira = (carteira: string) => {
    setFiltrosAvancados(prev => ({
      ...prev,
      carteira: prev.carteira.filter(c => c !== carteira)
    }));
  };

  const adicionarFiltroOperador = (operador: string) => {
    if (!filtrosAvancados.operador.includes(operador)) {
      setFiltrosAvancados(prev => ({
        ...prev,
        operador: [...prev.operador, operador]
      }));
    }
  }

  const removerFiltroOperador = (operador: string) => {
    setFiltrosAvancados(prev => ({
      ...prev,
      operador: prev.operador.filter(c => c !== operador)
    }));
  };

  const toggleAllColumns = (visible: boolean) => {
    const updatedColumns = Object.keys(colunasVisiveis).reduce((acc, col) => {
      acc[col] = visible;
      return acc;
    }, {} as Record<string, boolean>);
    setColunasVisiveis(updatedColumns);
  };

  const filtrosAtivosCount = useMemo(() => {
    return Object.entries(filtrosAvancados).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
  }, [filtrosAvancados]);

  const colunasVisiveisCount = useMemo(() => {
    return Object.values(colunasVisiveis).filter(Boolean).length;
  }, [colunasVisiveis]);

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-3 w-full justify-between">
        <div className="flex items-center space-x-3">
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

          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredDataLength} chamados
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              • {colunasVisiveisCount} colunas visíveis
            </span>
          </div>
        </div>

        <button
          className={`flex items-center space-x-2 px-3 py-2 text-sm rounded hover:bg-opacity-80 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Atualizar</span>
        </button>
      </div>

      {mostrarFiltros && (
        <div className={`absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg z-50 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}
          style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div className="p-6">
            <div className="flex space-x-1 mb-6">
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
                  <div>
                    <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-50' : 'text-gray-900'}`}>
                      <Tag className="w-4 h-4 inline mr-2" />
                      Status
                    </label>
                    <div className="space-y-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            adicionarFiltroStatus(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      >
                        <option value="">Adicionar status...</option>
                        {STATUS_LIST.filter(s => !filtrosAvancados.status.includes(s)).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <div className="flex flex-wrap gap-2">
                        {filtrosAvancados.status.map(status => (
                          <span
                            key={status}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {status}
                            <button
                              onClick={() => removerFiltroStatus(status)}
                              className="ml-1 hover:text-blue-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-50' : 'text-gray-900'}`}>
                      <Building className="w-4 h-4 inline mr-2" />
                      Carteiras
                    </label>
                    <div className="space-y-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            adicionarFiltroCarteira(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      >
                        <option value="">Adicionar carteira...</option>
                        {CARTEIRAS_LIST.filter(c => !filtrosAvancados.carteira.includes(c)).map(carteira => (
                          <option key={carteira} value={carteira}>{carteira}</option>
                        ))}
                      </select>
                      <div className="flex flex-wrap gap-2">
                        {filtrosAvancados.carteira.map(carteira => (
                          <span
                            key={carteira}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                          >
                            {carteira}
                            <button
                              onClick={() => removerFiltroCarteira(carteira)}
                              className="ml-1 hover:text-green-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

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
                        {OPERADOR_LIST.filter(c => !filtrosAvancados.operador.includes(c)).map(operador => (
                          <option key={operador} value={operador}>{operador}</option>
                        ))}
                      </select>
                      <div className="flex flex-wrap gap-2">
                        {filtrosAvancados.operador.map(operador => (
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
                  <div className={`mt-4 p-4 rounded-lg space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, tecnico: e.target.value }))}
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
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, cliente: e.target.value }))}
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
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, cidade: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                          <option value="">Todas as cidades</option>
                          {valoresUnicos.cidades?.map(cidades => (
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
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, temRetorno: e.target.value }))}
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
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, dataInicio: e.target.value }))}
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
                          onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, dataFim: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'colunas' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Configurar Colunas Visíveis
                  </h4>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;