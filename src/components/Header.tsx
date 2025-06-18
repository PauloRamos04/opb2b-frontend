'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import AdvancedFilters from '@/components/AdvancedFilters';
import { FilterState } from '@/constants/spreadsheet';

interface HeaderProps {
  isConnected: boolean;
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
  refreshData: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({
  isConnected,
  filtrosAvancados,
  setFiltrosAvancados,
  colunasVisiveis,
  setColunasVisiveis,
  mostrarFiltros,
  setMostrarFiltros,
  valoresUnicos,
  filteredDataLength,
  refreshData
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
            <AlertCircle className="w-6 h-6 text-indigo-600" />
            Sistema de Chamados B2B
          </h2>
          <div className="flex items-center space-x-4 mt-2">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <AdvancedFilters
            filtrosAvancados={filtrosAvancados}
            setFiltrosAvancados={setFiltrosAvancados}
            colunasVisiveis={colunasVisiveis}
            setColunasVisiveis={setColunasVisiveis}
            mostrarFiltros={mostrarFiltros}
            setMostrarFiltros={setMostrarFiltros}
            valoresUnicos={valoresUnicos}
            filteredDataLength={filteredDataLength}
          />

          <button
            onClick={refreshData}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;