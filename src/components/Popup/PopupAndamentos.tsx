import React from 'react';
import { AlertCircle, Plus, Clock } from 'lucide-react';

interface PopupAndamentosProps {
  descricao: string;
  novoAndamento: string;
  setNovoAndamento: React.Dispatch<React.SetStateAction<string>>;
  adicionarAndamento: (e?: React.MouseEvent) => Promise<void>;
  darkMode: boolean;
}

const PopupAndamentos: React.FC<PopupAndamentosProps> = ({
  descricao,
  novoAndamento,
  setNovoAndamento,
  adicionarAndamento,
  darkMode
}) => {
  const parseAndamentos = (descricao: string): string[] => {
    if (!descricao) return [];
    return descricao.split('\n').filter(line => line.trim() !== '');
  };
  const andamentos = parseAndamentos(descricao || '');

  return (
    <div>
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
          <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {andamentos.map((andamento, index) => (
              <div key={index} className={`p-4 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'} ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}> 
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{andamento}</p>
                  </div>
                  <div className={`ml-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum andamento registrado ainda</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Adicione o primeiro andamento acima</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupAndamentos; 