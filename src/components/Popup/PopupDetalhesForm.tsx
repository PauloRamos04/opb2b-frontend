import React from 'react';
import { User, Calendar, AlertCircle, Clock } from 'lucide-react';
import { STATUS_LIST, CARTEIRAS_LIST } from '@/constants';

interface PopupDetalhesFormProps {
  dados: any;
  novoAndamento: string;
  setNovoAndamento: React.Dispatch<React.SetStateAction<string>>;
  adicionarAndamento: (e?: React.MouseEvent) => Promise<void>;
  renderStatusBadge: (status: string) => JSX.Element;
  renderCarteiraBadge: (carteira: string) => JSX.Element;
  darkMode: boolean;
}

const PopupDetalhesForm: React.FC<PopupDetalhesFormProps> = ({
  dados,
  novoAndamento,
  setNovoAndamento,
  adicionarAndamento,
  renderStatusBadge,
  renderCarteiraBadge,
  darkMode
}) => {
  const parseAndamentos = (descricao: string): string[] => {
    if (!descricao) return [];
    return descricao.split('\n').filter(line => line.trim() !== '');
  };
  const andamentos = parseAndamentos(dados?.descricao || '');

  return (
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
              <input type="text" name="operador" defaultValue={dados.operador} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Status</label>
              <select name="status" defaultValue={dados.status} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                {STATUS_LIST.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Carteira</label>
              <select name="carteira" defaultValue={dados.carteira} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                {CARTEIRAS_LIST.map(carteira => (
                  <option key={carteira} value={carteira}>{carteira}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cidade</label>
              <input type="text" name="cidade" defaultValue={dados.cidade} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Técnico</label>
              <input type="text" name="tecnico" defaultValue={dados.tecnico} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cliente</label>
              <input type="text" name="cliente" defaultValue={dados.cliente} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Assunto</label>
              <input type="text" name="assuntos" defaultValue={dados.assuntos} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
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
          </div>
        </div>
      </div>
    </form>
  );
};

export default PopupDetalhesForm; 