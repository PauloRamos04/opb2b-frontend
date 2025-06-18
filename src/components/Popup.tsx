'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  X,
  Plus,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  PhoneCall
} from 'lucide-react';
import { STATUS_LIST, CARTEIRAS_LIST } from '@/constants/spreadsheet';

interface PopupProps {
  popup: {
    aberto: boolean;
    tipo: 'detalhes' | 'novo' | '';
    dados: any;
    linha: number | null;
  };
  novoAndamento: string;
  setNovoAndamento: React.Dispatch<React.SetStateAction<string>>;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  fecharPopup: () => void;
  adicionarAndamento: (e?: React.MouseEvent) => Promise<void>;
  salvarAlteracoesPopup: () => Promise<void>;
  pegarChamado: (dadosRow: any, actualRowIndex: number) => Promise<void>;
  renderStatusBadge: (status: string) => JSX.Element;
  renderCarteiraBadge: (carteira: string) => JSX.Element;
}

const Popup: React.FC<PopupProps> = ({
  popup,
  novoAndamento,
  setNovoAndamento,
  formValues,
  setFormValues,
  fecharPopup,
  adicionarAndamento,
  salvarAlteracoesPopup,
  pegarChamado,
  renderStatusBadge,
  renderCarteiraBadge
}) => {
  const { darkMode } = useTheme();

  if (!popup.aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {popup.tipo === 'novo' ? 'Novo Chamado' : `Chamado #${popup.dados?.historico} - ${popup.dados?.operador}`}
              </h2>
              {popup.tipo === 'detalhes' && (
                <div className="flex items-center space-x-4 mt-2">
                  {renderStatusBadge(popup.dados?.status || '')}
                  {renderCarteiraBadge(popup.dados?.carteira || '')}
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Aberto em: {popup.dados?.dataAbertura}
                  </span>
                  {popup.dados?.retorno && (
                    <span className={`text-sm flex items-center ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      <Clock className="w-3 h-3 mr-1" />
                      Retorno: {popup.dados.retorno}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={fecharPopup}
              className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {popup.tipo === 'detalhes' && popup.dados && (
            <form data-popup-form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Informações do Chamado
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Operador</label>
                      <input
                        type="text"
                        name="operador"
                        defaultValue={popup.dados.operador}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status</label>
                      <select
                        name="status"
                        defaultValue={popup.dados.status}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {STATUS_LIST.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Carteira</label>
                      <select
                        name="carteira"
                        defaultValue={popup.dados.carteira}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {CARTEIRAS_LIST.map(carteira => (
                          <option key={carteira} value={carteira}>{carteira}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cidade</label>
                      <input
                        type="text"
                        name="cidade"
                        defaultValue={popup.dados.cidade}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Técnico</label>
                      <input
                        type="text"
                        name="tecnico"
                        defaultValue={popup.dados.tecnico}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cliente</label>
                      <input
                        type="text"
                        name="cliente"
                        defaultValue={popup.dados.cliente}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
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
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Assunto</label>
                      <input
                        type="text"
                        name="assuntos"
                        defaultValue={popup.dados.assuntos}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Descrição Detalhada</label>
                      <textarea
                        name="descricao"
                        rows={6}
                        key={formValues.descricao || popup.dados.descricao}
                        defaultValue={formValues.descricao || popup.dados.descricao}
                        onChange={(e) => setFormValues((prev: any) => ({ ...prev, descricao: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                        }`}
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

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Adicionar Andamento</label>
                    <div className="flex gap-3">
                      <textarea
                        value={novoAndamento}
                        onChange={(e) => setNovoAndamento(e.target.value)}
                        placeholder="Descreva o andamento ou ação tomada..."
                        rows={3}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={adicionarAndamento}
                        disabled={!novoAndamento.trim()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed h-fit flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>

                  <div className={`border rounded-lg p-4 max-h-80 overflow-y-auto ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}>
                    {(formValues.descricao || popup.dados.descricao) ? (
                      <div className="space-y-4">
                        {(formValues.descricao || popup.dados.descricao).split('\n').filter(Boolean).map((andamento: string, index: number) => (
                          <div key={index} className={`p-4 rounded-lg border-l-4 border-indigo-500 ${
                            darkMode ? 'bg-gray-600' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                  {andamento}
                                </p>
                              </div>
                              <div className={`ml-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                #{index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Nenhum andamento registrado ainda
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Adicione o primeiro andamento acima
                        </p>
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
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>ID do Chamado</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{popup.dados.historico}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Data de Abertura</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{popup.dados.dataAbertura}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Última Edição</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{popup.dados.ultimaEdicao || 'Não editado'}</div>
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
                      {CARTEIRAS_LIST.map(carteira => (
                        <option key={carteira} value={carteira}>{carteira}</option>
                      ))}
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
                      {STATUS_LIST.slice(0, 3).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
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

        <div className={`p-6 border-t flex justify-between ${
          darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={fecharPopup}
            className={`px-6 py-2 border rounded-lg ${
              darkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancelar
          </button>

          <div className="flex space-x-3">
            {popup.tipo === 'detalhes' && (
              <>
                {!popup.dados?.retorno && (
                  <button
                    type="button"
                    onClick={() => pegarChamado(popup.dados, popup.linha!)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Pegar Chamado</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={salvarAlteracoesPopup}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </>
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
  );
};

export default Popup;