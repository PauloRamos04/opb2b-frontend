import React from 'react';
import { X, Clock } from 'lucide-react';
import { renderOperadorBadge } from '@/utils/badges';

interface PopupHeaderProps {
  tipo: 'detalhes' | 'novo' | '';
  dados: any;
  fecharPopup: () => void;
  renderStatusBadge: (status: string) => JSX.Element;
  renderCarteiraBadge: (carteira: string) => JSX.Element;
  darkMode: boolean;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({
  tipo,
  dados,
  fecharPopup,
  renderStatusBadge,
  renderCarteiraBadge,
  darkMode
}) => (
  <div className={`p-6 border-b ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {tipo === 'novo' ? 'Novo Chamado' : `Chamado #${dados?.historico} - ${dados?.operador}`}
        </h2>
        {tipo === 'detalhes' && (
          <div className="flex items-center space-x-4 mt-2">
            {renderStatusBadge(dados?.status || '')}
            {renderCarteiraBadge(dados?.carteira || '')}
            {renderOperadorBadge(dados?.operador || '', darkMode)}
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aberto em: {dados?.dataAbertura}
            </span>
            {dados?.retorno && (
              <span className={`text-sm flex items-center ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                <Clock className="w-3 h-3 mr-1" />
                Retorno: {dados.retorno}
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
);

export default PopupHeader; 