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
import { STATUS_LIST, CARTEIRAS_LIST } from '@/constants';
import { renderOperadorBadge } from '@/utils/badges';

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

  const parseAndamentos = (descricao: string): string[] => {
    if (!descricao) return [];
    return descricao.split('\n').filter(line => line.trim() !== '');
  };

  const andamentos = parseAndamentos(popup.dados?.descricao || '');

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
                  {renderOperadorBadge(popup.dados?.operador || '', darkMode)}
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
                  <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status</label>
                      <select
                        name="status"
                        defaultValue={popup.dados.status}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Técnico</label>
                      <input
                        type="text"
                        name="tecnico"
                        defaultValue={popup.dados.tecnico}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cliente</label>
                      <input
                        type="text"
                        name="cliente"
                        defaultValue={popup.dados.cliente}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Assunto</label>
                      <input
                        type="text"
                        name="assuntos"
                        defaultValue={popup.dados.assuntos}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-medium flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <AlertCircle className="w-5 h-5 text-indigo-600" />
                      Histórico de Andamentos
                    </h3>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {andamentos.length} andamento(s)
                    </span>
                  </div>

                  <div className={`mb-6 p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Adicionar Novo Andamento
                    </label>
                    <div className="flex space-x-3">
                      <textarea
                        rows={3}
                        value={novoAndamento}
                        onChange={(e) => setNovoAndamento(e.target.value)}
                        placeholder="Digite o novo andamento aqui..."
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                          }`}
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
                      <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                        {andamentos.map((andamento, index) => (
                          <div key={index} className={`p-4 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'} ${darkMode ? 'bg-gray-600' : 'bg-gray-50'
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


              </div>
            </form>
          )}

          {popup.tipo === 'novo' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Operador *</label>
                    <input
                      type="text"
                      placeholder="Nome do operador responsável"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cliente *</label>
                    <input
                      type="text"
                      placeholder="Nome do cliente"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Carteira *</label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                      <option value="">Selecione uma carteira</option>
                      {CARTEIRAS_LIST.map(carteira => (
                        <option key={carteira} value={carteira}>{carteira}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status *</label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                      {STATUS_LIST.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Descrição *</label>
                    <textarea
                      rows={4}
                      placeholder="Descreva o problema ou solicitação..."
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`flex items-center justify-between p-6 border-t ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
          <button
            onClick={fecharPopup}
            className={`px-6 py-2 border rounded-lg ${darkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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