import React from 'react';
import { X, CheckCircle, Clock, Calendar } from 'lucide-react';

interface ChamadoModalProps {
  popup: any;
  fecharPopup: () => void;
  novoAndamento: string;
  setNovoAndamento: (value: string) => void;
  adicionarAndamento: () => void;
  salvarAlteracoesPopup: () => void;
  valoresUnicos: any;
  darkMode: boolean;
}

const ChamadoModal: React.FC<ChamadoModalProps> = ({
  popup,
  fecharPopup,
  novoAndamento,
  setNovoAndamento,
  adicionarAndamento,
  salvarAlteracoesPopup,
  valoresUnicos,
  darkMode
}) => {
  if (!popup.aberto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {popup.tipo === 'detalhes' ? `📋 Detalhes do Chamado #${popup.dados?.id}` : '📝 Novo Chamado'}
          </h3>
          <button
            onClick={fecharPopup}
            className={`p-2 rounded-lg hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {popup.tipo === 'detalhes' && (
            <form data-popup-form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Operador
                  </label>
                  <input
                    name="operador"
                    type="text"
                    defaultValue={popup.dados?.operador || ''}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={popup.dados?.status || ''}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Selecione um status</option>
                    {valoresUnicos.status.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Carteira
                  </label>
                  <select
                    name="carteira"
                    defaultValue={popup.dados?.carteira || ''}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Selecione uma carteira</option>
                    {valoresUnicos.carteiras.map(carteira => (
                      <option key={carteira} value={carteira}>{carteira}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Cidade
                  </label>
                  <input
                    name="cidade"
                    type="text"
                    defaultValue={popup.dados?.cidade || ''}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Técnico
                  </label>
                  <input
                    name="tecnico"
                    type="text"
                    defaultValue={popup.dados?.tecnico || ''}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Cliente
                  </label>
                  <input
                    name="cliente"
                    type="text"
                    defaultValue={popup.dados?.cliente || ''}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Assunto
                </label>
                <input
                  name="assunto"
                  type="text"
                  defaultValue={popup.dados?.assunto || ''}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-medium flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Andamentos do Chamado
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="flex gap-3">
                    <textarea
                      value={novoAndamento}
                      onChange={(e) => setNovoAndamento(e.target.value)}
                      placeholder="Digite aqui o novo andamento do chamado..."
                      rows={3}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={adicionarAndamento}
                      disabled={!novoAndamento.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed self-start"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className={`border rounded-lg p-4 max-h-64 overflow-y-auto ${
                  darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Histórico de Andamentos
                  </h4>
                  
                  <div className="space-y-3">
                    {popup.dados?.descricao ? (
                      <div className="space-y-4">
                        {popup.dados.descricao.split('\n').filter(Boolean).map((andamento: string, index: number) => (
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
                  <h3 className={`text-lg font-medium mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Informações do Sistema
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>ID do Chamado</div>
                      <div className={`text-lg font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        #{popup.dados?.id}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Data de Abertura</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                        {popup.dados?.dataAbertura || 'Não informado'}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Última Edição</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                        {popup.dados?.ultimaEdicao || 'Não informado'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {popup.tipo === 'novo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Operador *
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do operador"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Carteira *
                  </label>
                  <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option value="">Selecione uma carteira</option>
                    {valoresUnicos.carteiras.map(carteira => (
                      <option key={carteira} value={carteira}>{carteira}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Cliente *
                  </label>
                  <input
                    type="text"
                    placeholder="Nome ou razão social do cliente"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Cidade *
                  </label>
                  <input
                    type="text"
                    placeholder="Cidade do atendimento"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Técnico
                  </label>
                  <input
                    type="text"
                    placeholder="Técnico responsável"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select 
                    defaultValue="EM ANÁLISE"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="EM ANÁLISE">EM ANÁLISE</option>
                    <option value="AGENDADA">AGENDADA</option>
                    <option value="EM ATD - USO">EM ATD - USO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Assunto *
                </label>
                <input
                  type="text"
                  placeholder="Resumo do problema ou solicitação"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Descrição Detalhada *
                </label>
                <textarea
                  rows={6}
                  placeholder="Descreva detalhadamente o problema ou solicitação do cliente..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
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
            className={`px-6 py-2 border rounded-lg hover:bg-opacity-80 ${
              darkMode 
                ? 'border-gray-500 text-gray-300 hover:bg-gray-600' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
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
  );
};

export default ChamadoModal;