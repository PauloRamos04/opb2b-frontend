import React, { useState } from 'react';
import { User, Sliders, FileText, AlertCircle, Clock, Plus } from 'lucide-react';
import { STATUS_LIST, CARTEIRAS_LIST, OPERADOR_LIST, TECNICO_LIST } from '@/constants';

interface PopupDetalhesFormProps {
  dados: any;
  darkMode: boolean;
  novoAndamento: string;
  setNovoAndamento: React.Dispatch<React.SetStateAction<string>>;
  adicionarAndamento: (e?: React.MouseEvent) => Promise<void>;
  renderStatusBadge: (status: string) => JSX.Element;
  renderCarteiraBadge: (carteira: string) => JSX.Element;
}

const PopupDetalhesForm: React.FC<PopupDetalhesFormProps> = ({
  dados,
  darkMode,
  novoAndamento,
  setNovoAndamento,
  adicionarAndamento,
}) => {
  const [activeTab, setActiveTab] = useState('detalhes');
  
  const parseAndamentos = (descricao: string): string[] => {
    if (!descricao) return [];
    return descricao.split('\n').filter(line => line.trim() !== '');
  };
  const andamentos = parseAndamentos(dados?.descricao || '');

  const getTabClass = (tabName: string) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer transition-colors duration-200 ease-in-out flex items-center gap-2 ` +
    (activeTab === tabName
      ? `border-b-2 border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
      : `${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} hover:bg-gray-500/10`);

  const renderContent = () => {
    switch (activeTab) {
      case 'detalhes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status</label>
              <select name="status" defaultValue={dados.status} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                {STATUS_LIST.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cliente</label>
              <input type="text" name="cliente" defaultValue={dados.cliente} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Assunto</label>
              <input type="text" name="assuntos" defaultValue={dados.assuntos} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
             <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Descrição do Problema</label>
                <textarea name="descricao" rows={5} defaultValue={dados.descricao} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
          </div>
        );
      case 'atribuicao':
        return (
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Operador</label>
                    <select name="operador" defaultValue={dados.operador} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                        {OPERADOR_LIST.map(operador => <option key={operador} value={operador}>{operador}</option>)}
                    </select>
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Carteira</label>
                    <select name="carteira" defaultValue={dados.carteira} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                        {CARTEIRAS_LIST.map(carteira => <option key={carteira} value={carteira}>{carteira}</option>)}
                    </select>
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Técnico</label>
                    <select name="tecnico" defaultValue={dados.tecnico} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                        {TECNICO_LIST.map(tecnico => <option key={tecnico} value={tecnico}>{tecnico}</option>)}
                    </select>
                </div>
              </div>

            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-medium flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                    Histórico de Andamentos
                    </h3>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{andamentos.length} andamento(s)</span>
                </div>
                <div className={`mb-6 p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Adicionar Novo Andamento</label>
                    <div className="flex space-x-3">
                    <textarea
                        rows={3}
                        value={novoAndamento}
                        onChange={(e) => setNovoAndamento(e.target.value)}
                        placeholder="Digite o novo andamento aqui..."
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                    <button
                        type="button"
                        onClick={adicionarAndamento}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 self-start"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar</span>
                    </button>
                    </div>
                </div>
                <div className={`border rounded-lg ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Andamentos Registrados</h4>
                    </div>
                    {andamentos.length > 0 ? (
                    <div className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                        {andamentos.map((andamento, index) => (
                        <div key={index} className={`p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{andamento}</p>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-8">
                        <Clock className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum andamento registrado ainda.</p>
                    </div>
                    )}
                </div>
            </div>

          </div>
        );
      case 'sistema':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>ID do Chamado</div>
              <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{dados.historico}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Data de Abertura</div>
              <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{dados.dataAbertura}</div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Última Edição</div>
              <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{dados.ultimaEdicao || 'Não editado'}</div>
            </div>
             <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cidade</label>
                <input type="text" name="cidade" readOnly defaultValue={dados.cidade} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form data-popup-form onSubmit={(e) => e.preventDefault()}>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          <button type="button" onClick={() => setActiveTab('detalhes')} className={getTabClass('detalhes')}>
            <FileText size={16} /> Detalhes do Chamado
          </button>
          <button type="button" onClick={() => setActiveTab('atribuicao')} className={getTabClass('atribuicao')}>
            <User size={16} /> Atribuição e Andamento
          </button>
          <button type="button" onClick={() => setActiveTab('sistema')} className={getTabClass('sistema')}>
            <Sliders size={16} /> Dados do Sistema
          </button>
        </nav>
      </div>
      <div className="pt-4">
        {renderContent()}
      </div>
    </form>
  );
};

export default PopupDetalhesForm; 