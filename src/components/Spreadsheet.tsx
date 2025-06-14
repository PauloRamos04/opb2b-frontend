'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSpreadsheet } from '@/contexts/SpreadsheetContext';
import { 
  Edit, 
  Eye, 
  RefreshCw, 
  Filter, 
  X, 
  Search, 
  EyeOff, 
  Plus, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Settings,
  ChevronDown,
  Download,
  Upload
} from 'lucide-react';
import { getUniqueValues, filterData, truncateText } from '@/utils/functions';

interface PopupData {
  aberto: boolean;
  tipo: 'detalhes' | 'novo' | '';
  dados: any;
  linha: number | null;
}

const Spreadsheet: React.FC = () => {
  const { data, loading, error, filters, setFilters, updateCell, refreshData, isConnected } = useSpreadsheet();
  
  const [filteredData, setFilteredData] = useState<string[][]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [popup, setPopup] = useState<PopupData>({ aberto: false, tipo: '', dados: null, linha: null });
  const [novoAndamento, setNovoAndamento] = useState('');
  
  const [filtrosAvancados, setFiltrosAvancados] = useState({
    operador: '',
    status: '',
    carteira: '',
    cidade: '',
    tecnico: '',
    dataInicio: '',
    dataFim: '',
    buscaGeral: '',
    prioridade: ''
  });

  const [colunasVisiveis, setColunasVisiveis] = useState({
    OPERADOR: true,
    'Histórico': true,
    STATUS: true,
    ASSUNTO: true,
    CARTEIRA: true,
    CIDADE: true,
    TEC: true,
    'DESCRIÇÃO': true,
    'DATA ABERTURA': true,
    H_RETORNO: false,
    RETORNO: false,
    'RESOLUÇÃO BO:': false,
    CLIENTE: false,
    UF: false,
    REGIONAL: false,
    'ÚLTIMA EDIÇÃO': true
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const tableColumnOrder = [
    'OPERADOR', 'Histórico', 'STATUS', 'ASSUNTO', 'CARTEIRA', 
    'CIDADE', 'TEC', 'DESCRIÇÃO', 'DATA ABERTURA', 'H_RETORNO', 
    'RETORNO', 'RESOLUÇÃO BO:', 'CLIENTE', 'UF', 'REGIONAL', 'ÚLTIMA EDIÇÃO'
  ];

  const columnIndices = {
    'Histórico': 0, 'DATA ABERTURA': 1, 'OP': 2, 'DESCRIÇÃO': 3,
    'RETORNO': 4, 'TME': 5, 'H_FINALIZADA': 6, 'OPERADOR': 7,
    'SERVIÇO': 8, 'CUMPRIDA': 9, 'VT': 10, 'PROC': 11,
    'CARTEIRA': 12, 'TEC': 13, 'CAMINHO': 14, 'BAIRRO': 15,
    'H_RETORNO': 16, 'CIDADE': 17, 'RUA': 18, 'ASSUNTO': 19,
    'RESOLUÇÃO BO:': 20, 'UF': 21, 'REGIONAL': 22, 'CONTRATO :': 23,
    'CLIENTE': 24, 'STATUS': 25, 'ÚLTIMA EDIÇÃO': 27
  };

  const valoresUnicos = useMemo(() => {
    if (data.length === 0) return {
      operadores: [],
      status: [],
      carteiras: [],
      cidades: [],
      tecnicos: []
    };
    
    const dataStartRow = 8;
    const dataRows = data.slice(dataStartRow);
    
    return {
      operadores: getUniqueValues(dataRows.map(row => row[columnIndices.OPERADOR] || '')),
      status: getUniqueValues(dataRows.map(row => row[columnIndices.STATUS] || '')),
      carteiras: getUniqueValues(dataRows.map(row => row[columnIndices.CARTEIRA] || '')),
      cidades: getUniqueValues(dataRows.map(row => row[columnIndices.CIDADE] || '')),
      tecnicos: getUniqueValues(dataRows.map(row => row[columnIndices.TEC] || ''))
    };
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      applyFilters();
    }
  }, [data, filtrosAvancados]);

  const applyFilters = () => {
    const dataStartRow = 8;
    const dataRows = data.slice(dataStartRow);
    
    const filtered = filterData(dataRows, filtrosAvancados, columnIndices);
    setFilteredData(filtered);
  };

  const handleCellEdit = (row: number, col: number, value: string) => {
    setEditingCell({ row, col });
    setEditValue(value);
  };

  const handleSaveEdit = async () => {
    if (editingCell) {
      try {
        console.log('Tentando salvar célula:', {
          row: editingCell.row,
          col: editingCell.col,
          value: editValue
        });

        const response = await updateCell(editingCell.row, editingCell.col, editValue);
        console.log('Resposta do salvamento:', response);
        
        setEditingCell(null);
        setEditValue('');
        
        await refreshData();
        
      } catch (error) {
        console.error('Erro completo ao salvar:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        alert(`Erro ao salvar: ${errorMessage}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getCellValue = (row: string[], colName: string): string => {
    const colIndex = columnIndices[colName as keyof typeof columnIndices];
    return row[colIndex] || '';
  };

  const abrirPopup = (tipo: 'detalhes' | 'novo', dados: any = null, linha: number | null = null) => {
    setPopup({ aberto: true, tipo, dados, linha });
    setNovoAndamento('');
  };

  const fecharPopup = () => {
    setPopup({ aberto: false, tipo: '', dados: null, linha: null });
    setNovoAndamento('');
  };

  const testarConexaoAPI = async () => {
    try {
      console.log('🧪 Testando conexão...');
      const response = await fetch('http://localhost:3001/spreadsheet/data');
      const result = await response.json();
      
      console.log('📡 Resultado do teste:', result);
      
      if (result.success) {
        alert(`✅ Conexão OK! ${result.data?.length || 0} linhas encontradas`);
      } else {
        alert(`❌ Erro na conexão: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro no teste: ${errorMessage}`);
    }
  };

  const testarSalvamentoAPI = async () => {
    try {
      console.log('💾 Testando salvamento...');
      const testData = {
        row: 10,
        col: 0,
        value: `TESTE_${new Date().toLocaleTimeString()}`
      };
      
      const response = await fetch('http://localhost:3001/spreadsheet/update-cell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const result = await response.json();
      console.log('💾 Resultado do teste de salvamento:', result);
      
      if (result.success) {
        alert('✅ Teste de salvamento OK! Verifique a planilha.');
        await refreshData();
      } else {
        alert(`❌ Erro no salvamento: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro no teste de salvamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro no teste: ${errorMessage}`);
    }
  };

  const adicionarAndamento = async () => {
    if (!novoAndamento.trim()) {
      alert('Por favor, digite um andamento antes de salvar.');
      return;
    }
    
    try {
      console.log('💾 Adicionando andamento:', novoAndamento);
      
      const timestamp = new Date().toLocaleString('pt-BR');
      const novoAndamentoCompleto = `${timestamp} - ${novoAndamento}`;
      
      const rowIndex = popup.linha;
      const colIndex = columnIndices['DESCRIÇÃO'];
      
      console.log('📍 Salvando em:', { row: rowIndex, col: colIndex });
      
      if (rowIndex !== null) {
        const valorAtual = popup.dados?.descricao || '';
        const novoValor = valorAtual 
          ? `${valorAtual}\n${novoAndamentoCompleto}`
          : novoAndamentoCompleto;
        
        console.log('📝 Novo valor:', novoValor);
        
        await updateCell(rowIndex, colIndex, novoValor);
        
        setPopup(prev => ({
          ...prev,
          dados: { ...prev.dados, descricao: novoValor }
        }));
        
        setNovoAndamento('');
        alert('✅ Andamento adicionado com sucesso!');
        
      } else {
        throw new Error('Linha não encontrada');
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar andamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro ao salvar: ${errorMessage}`);
    }
  };

  const salvarAlteracoesPopup = async () => {
    try {
      console.log('💾 Salvando todas as alterações do popup...');
      
      if (!popup.dados || popup.linha === null) {
        throw new Error('Dados do popup não encontrados');
      }

      const form = document.querySelector('[data-popup-form]') as HTMLFormElement;
      if (!form) {
        throw new Error('Formulário não encontrado');
      }

      const formData = new FormData(form);
      const updates: Array<{row: number, col: number, value: string}> = [];

      const fieldMapping = {
        'operador': 'OPERADOR',
        'status': 'STATUS', 
        'carteira': 'CARTEIRA',
        'cidade': 'CIDADE',
        'tecnico': 'TEC',
        'cliente': 'CLIENTE',
        'assunto': 'ASSUNTO',
        'descricao': 'DESCRIÇÃO'
      };

      Object.entries(fieldMapping).forEach(([fieldName, columnName]) => {
        const value = formData.get(fieldName) as string;
        if (value !== null) {
          const colIndex = columnIndices[columnName as keyof typeof columnIndices];
          updates.push({
            row: popup.linha!,
            col: colIndex,
            value: value
          });
        }
      });

      console.log('📋 Updates preparados:', updates);

      for (const update of updates) {
        await updateCell(update.row, update.col, update.value);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      alert('✅ Todas as alterações foram salvas com sucesso!');
      
      fecharPopup();
      await refreshData();
      
    } catch (error) {
      console.error('❌ Erro ao salvar alterações:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro ao salvar: ${errorMessage}`);
    }
  };

  const limparFiltros = () => {
    setFiltrosAvancados({
      operador: '',
      status: '',
      carteira: '',
      cidade: '',
      tecnico: '',
      dataInicio: '',
      dataFim: '',
      buscaGeral: '',
      prioridade: ''
    });
  };

  const renderStatusBadge = (status: string) => {
    const statusClasses = {
      'EM ANÁLISE': 'bg-orange-500 text-white',
      'FINALIZADO': 'bg-green-500 text-white',
      'AGENDADA': 'bg-blue-500 text-white',
      'EM ATD - USO': 'bg-emerald-500 text-white',
      'ANULADA': 'bg-gray-500 text-white',
      'FINALIZADO / VT': 'bg-teal-600 text-white',
      'SEM CONTATO #UD': 'bg-red-500 text-white',
      'SEM CONTATO 2': 'bg-red-600 text-white',
      'SEM CONTATO 3': 'bg-red-700 text-white',
      'AGUARDANDO - NOC': 'bg-indigo-500 text-white',
      'AGUARDANDO - ENGENHARIA': 'bg-purple-500 text-white',
      'AGUARDANDO - TI': 'bg-teal-500 text-white',
      'AGUARDANDO - TELEFONIA': 'bg-cyan-500 text-white',
      'AGUARDANDO - REDE EXTERNA': 'bg-lime-500 text-black',
      'AGUARDANDO - OPERAÇÕES B2B': 'bg-yellow-500 text-black'
    };

    const className = statusClasses[status as keyof typeof statusClasses] || 'bg-gray-200 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {status}
      </span>
    );
  };

  const renderCarteiraBadge = (carteira: string) => {
    const carteiraClasses = {
      'ALEGRA': 'bg-red-400 text-white',
      'CABOTELECOM': 'bg-teal-400 text-white',
      'CORTEZ': 'bg-blue-400 text-white',
      'CONEXÃO': 'bg-orange-300 text-white',
      'DIRETA': 'bg-green-300 text-white',
      'IP3': 'bg-pink-400 text-white',
      'MEGA': 'bg-indigo-400 text-white',
      'MULTIPLAY': 'bg-purple-400 text-white',
      'NETVGA': 'bg-blue-300 text-white',
      'NOWTECH': 'bg-teal-300 text-white',
      'OUTCENTER': 'bg-green-400 text-white',
      'RESENDENET': 'bg-yellow-300 text-black',
      'SAPUCAINET': 'bg-orange-400 text-white',
      'STARWEB': 'bg-amber-400 text-white',
      'TECNET': 'bg-gray-400 text-white',
      'WAYNET': 'bg-red-300 text-white',
      'WEBNET': 'bg-cyan-400 text-white',
      'WEBBY': 'bg-purple-300 text-white',
      'AZZA': 'bg-yellow-400 text-black'
    };

    const className = carteiraClasses[carteira as keyof typeof carteiraClasses] || 'bg-gray-200 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {carteira}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando dados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <X className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">Erro: {error}</span>
        </div>
        <button
          onClick={refreshData}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
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
              <span className="text-gray-600">{filteredData.length} chamados encontrados</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={testarConexaoAPI}
              className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Testar API</span>
            </button>
            
            <button
              onClick={testarSalvamentoAPI}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Testar Salvamento</span>
            </button>
            
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                mostrarFiltros ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={() => abrirPopup('novo')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Chamado</span>
            </button>
            
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {mostrarFiltros && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Busca Geral</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar em todos os campos..."
                    value={filtrosAvancados.buscaGeral}
                    onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, buscaGeral: e.target.value }))}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operador</label>
                <select
                  value={filtrosAvancados.operador}
                  onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, operador: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Todos os operadores</option>
                  {valoresUnicos.operadores?.map(operador => (
                    <option key={operador} value={operador}>{operador}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filtrosAvancados.status}
                  onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  {valoresUnicos.status?.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carteira</label>
                <select
                  value={filtrosAvancados.carteira}
                  onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, carteira: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Todas as carteiras</option>
                  {valoresUnicos.carteiras?.map(carteira => (
                    <option key={carteira} value={carteira}>{carteira}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  placeholder="Filtrar por cidade..."
                  value={filtrosAvancados.cidade}
                  onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, cidade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Técnico</label>
                <input
                  type="text"
                  placeholder="Filtrar por técnico..."
                  value={filtrosAvancados.tecnico}
                  onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, tecnico: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                <input
                  type="date"
                  value={filtrosAvancados.dataInicio}
                  onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                <input
                  type="date"
                  value={filtrosAvancados.dataFim}
                  onChange={(e) => setFiltrosAvancados(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Colunas Visíveis</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.entries(colunasVisiveis).map(([coluna, visivel]) => (
                  <label key={coluna} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visivel}
                      onChange={(e) => setColunasVisiveis(prev => ({ ...prev, [coluna]: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{coluna}</span>
                    {visivel ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={limparFiltros}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar todos os filtros
              </button>
              
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  <Upload className="w-4 h-4" />
                  <span>Importar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ações
                </th>
                {tableColumnOrder
                  .filter(colName => colunasVisiveis[colName as keyof typeof colunasVisiveis])
                  .map((colName) => (
                  <th key={colName} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    {colName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row, rowIndex) => {
                const actualRowIndex = rowIndex + 8;
                const dadosRow = {
                  id: actualRowIndex,
                  operador: getCellValue(row, 'OPERADOR'),
                  historico: getCellValue(row, 'Histórico'),
                  status: getCellValue(row, 'STATUS'),
                  assunto: getCellValue(row, 'ASSUNTO'),
                  carteira: getCellValue(row, 'CARTEIRA'),
                  cidade: getCellValue(row, 'CIDADE'),
                  tecnico: getCellValue(row, 'TEC'),
                  descricao: getCellValue(row, 'DESCRIÇÃO'),
                  dataAbertura: getCellValue(row, 'DATA ABERTURA'),
                  cliente: getCellValue(row, 'CLIENTE'),
                  ultimaEdicao: getCellValue(row, 'ÚLTIMA EDIÇÃO')
                };

                return (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => abrirPopup('detalhes', dadosRow, actualRowIndex)}
                          className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                      </div>
                    </td>
                    {tableColumnOrder
                      .filter(colName => colunasVisiveis[colName as keyof typeof colunasVisiveis])
                      .map((colName) => {
                      const value = getCellValue(row, colName);
                      const colIndex = columnIndices[colName as keyof typeof columnIndices];
                      
                      return (
                        <td key={colName} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                          {editingCell?.row === actualRowIndex && editingCell?.col === colIndex ? (
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit();
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                autoFocus
                              />
                              <button
                                onClick={handleSaveEdit}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                              >
                                ✗
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="max-w-xs truncate cursor-pointer hover:bg-gray-100 p-1 rounded"
                              onClick={() => handleCellEdit(actualRowIndex, colIndex, value)}
                            >
                              {colName === 'STATUS' ? renderStatusBadge(value) :
                               colName === 'CARTEIRA' ? renderCarteiraBadge(value) :
                               colName === 'OPERADOR' && value.toUpperCase() === 'LIVRE' ? (
                                 <span className="text-green-600 font-medium flex items-center">
                                   <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                   {value}
                                 </span>
                               ) : (
                                 <span title={value}>{value}</span>
                               )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Nenhum registro encontrado</h3>
            <p className="text-sm">Ajuste os filtros ou adicione novos chamados</p>
          </div>
        )}
      </div>

      {popup.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {popup.tipo === 'novo' ? 'Novo Chamado' : `Chamado #${popup.dados?.historico} - ${popup.dados?.operador}`}
                  </h2>
                  {popup.tipo === 'detalhes' && (
                    <div className="flex items-center space-x-4 mt-2">
                      {renderStatusBadge(popup.dados?.status || '')}
                      {renderCarteiraBadge(popup.dados?.carteira || '')}
                      <span className="text-sm text-gray-500">
                        Aberto em: {popup.dados?.dataAbertura}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={fecharPopup}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {popup.tipo === 'detalhes' && popup.dados && (
                <form data-popup-form>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Informações do Chamado
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Operador</label>
                          <input
                            type="text"
                            name="operador"
                            defaultValue={popup.dados.operador}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            name="status"
                            defaultValue={popup.dados.status}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="EM ANÁLISE">EM ANÁLISE</option>
                            <option value="FINALIZADO">FINALIZADO</option>
                            <option value="AGENDADA">AGENDADA</option>
                            <option value="EM ATD - USO">EM ATD - USO</option>
                            <option value="ANULADA">ANULADA</option>
                            <option value="FINALIZADO / VT">FINALIZADO / VT</option>
                            <option value="SEM CONTATO #UD">SEM CONTATO #UD</option>
                            <option value="SEM CONTATO 2">SEM CONTATO 2</option>
                            <option value="SEM CONTATO 3">SEM CONTATO 3</option>
                            <option value="AGUARDANDO - NOC">AGUARDANDO - NOC</option>
                            <option value="AGUARDANDO - ENGENHARIA">AGUARDANDO - ENGENHARIA</option>
                            <option value="AGUARDANDO - TI">AGUARDANDO - TI</option>
                            <option value="AGUARDANDO - TELEFONIA">AGUARDANDO - TELEFONIA</option>
                            <option value="AGUARDANDO - REDE EXTERNA">AGUARDANDO - REDE EXTERNA</option>
                            <option value="AGUARDANDO - OPERAÇÕES B2B">AGUARDANDO - OPERAÇÕES B2B</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Carteira</label>
                          <select
                            name="carteira"
                            defaultValue={popup.dados.carteira}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="ALEGRA">ALEGRA</option>
                            <option value="CABOTELECOM">CABOTELECOM</option>
                            <option value="CORTEZ">CORTEZ</option>
                            <option value="CONEXÃO">CONEXÃO</option>
                            <option value="DIRETA">DIRETA</option>
                            <option value="IP3">IP3</option>
                            <option value="MEGA">MEGA</option>
                            <option value="MULTIPLAY">MULTIPLAY</option>
                            <option value="NETVGA">NETVGA</option>
                            <option value="NOWTECH">NOWTECH</option>
                            <option value="OUTCENTER">OUTCENTER</option>
                            <option value="RESENDENET">RESENDENET</option>
                            <option value="SAPUCAINET">SAPUCAINET</option>
                            <option value="STARWEB">STARWEB</option>
                            <option value="TECNET">TECNET</option>
                            <option value="WAYNET">WAYNET</option>
                            <option value="WEBNET">WEBNET</option>
                            <option value="WEBBY">WEBBY</option>
                            <option value="AZZA">AZZA</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                          <input
                            type="text"
                            name="cidade"
                            defaultValue={popup.dados.cidade}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Técnico</label>
                          <input
                            type="text"
                            name="tecnico"
                            defaultValue={popup.dados.tecnico}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                          <input
                            type="text"
                            name="cliente"
                            defaultValue={popup.dados.cliente}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                        Detalhes do Problema
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                          <input
                            type="text"
                            name="assunto"
                            defaultValue={popup.dados.assunto}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada</label>
                          <textarea
                            name="descricao"
                            rows={6}
                            defaultValue={popup.dados.descricao}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Descreva detalhadamente o problema reportado..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Histórico de Andamentos
                      </h3>
                      
                      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar Andamento</label>
                        <div className="flex gap-3">
                          <textarea
                            value={novoAndamento}
                            onChange={(e) => setNovoAndamento(e.target.value)}
                            placeholder="Descreva o andamento ou ação tomada..."
                            rows={3}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <button
                            onClick={adicionarAndamento}
                            disabled={!novoAndamento.trim()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed h-fit flex items-center space-x-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Adicionar</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border rounded-lg p-4 max-h-80 overflow-y-auto">
                        {popup.dados.descricao ? (
                          <div className="space-y-4">
                            {popup.dados.descricao.split('\n').filter(Boolean).map((andamento: string, index: number) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{andamento}</p>
                                  </div>
                                  <div className="ml-4 text-xs text-gray-500">
                                    #{index + 1}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Nenhum andamento registrado ainda</p>
                            <p className="text-xs">Adicione o primeiro andamento acima</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Informações do Sistema
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium text-gray-700">ID do Chamado</div>
                          <div className="text-gray-900">{popup.dados.historico}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium text-gray-700">Data de Abertura</div>
                          <div className="text-gray-900">{popup.dados.dataAbertura}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium text-gray-700">Última Edição</div>
                          <div className="text-gray-900">{popup.dados.ultimaEdicao || 'Não editado'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {popup.tipo === 'novo' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Operador *</label>
                        <input
                          type="text"
                          placeholder="Nome do operador responsável"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                        <input
                          type="text"
                          placeholder="Nome do cliente"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Carteira *</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                          <option value="">Selecionar carteira</option>
                          <option value="ALEGRA">ALEGRA</option>
                          <option value="CABOTELECOM">CABOTELECOM</option>
                          <option value="CORTEZ">CORTEZ</option>
                          <option value="CONEXÃO">CONEXÃO</option>
                          <option value="DIRETA">DIRETA</option>
                          <option value="IP3">IP3</option>
                          <option value="MEGA">MEGA</option>
                          <option value="MULTIPLAY">MULTIPLAY</option>
                          <option value="NETVGA">NETVGA</option>
                          <option value="NOWTECH">NOWTECH</option>
                          <option value="OUTCENTER">OUTCENTER</option>
                          <option value="RESENDENET">RESENDENET</option>
                          <option value="SAPUCAINET">SAPUCAINET</option>
                          <option value="STARWEB">STARWEB</option>
                          <option value="TECNET">TECNET</option>
                          <option value="WAYNET">WAYNET</option>
                          <option value="WEBNET">WEBNET</option>
                          <option value="WEBBY">WEBBY</option>
                          <option value="AZZA">AZZA</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
                        <input
                          type="text"
                          placeholder="Cidade do atendimento"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Técnico</label>
                        <input
                          type="text"
                          placeholder="Técnico responsável"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                          defaultValue="EM ANÁLISE"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="EM ANÁLISE">EM ANÁLISE</option>
                          <option value="AGENDADA">AGENDADA</option>
                          <option value="EM ATD - USO">EM ATD - USO</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assunto *</label>
                    <input
                      type="text"
                      placeholder="Resumo do problema ou solicitação"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada *</label>
                    <textarea
                      rows={6}
                      placeholder="Descreva detalhadamente o problema ou solicitação do cliente..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                onClick={fecharPopup}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <div className="flex space-x-3">
                {popup.tipo === 'detalhes' && (
                  <button 
                    type="button"
                    onClick={salvarAlteracoesPopup}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                )}
                {popup.tipo === 'novo' && (
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Criar Chamado
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spreadsheet;