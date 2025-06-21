import React from 'react';
import { PhoneCall, CheckCircle } from 'lucide-react';

interface PopupFooterProps {
  tipo: 'detalhes' | 'novo' | '';
  dados: any;
  linha: number | null;
  fecharPopup: () => void;
  salvarAlteracoesPopup: () => Promise<void>;
  pegarChamado: (dadosRow: any, actualRowIndex: number) => Promise<void>;
  darkMode: boolean;
}

const PopupFooter: React.FC<PopupFooterProps> = ({
  tipo,
  dados,
  linha,
  fecharPopup,
  salvarAlteracoesPopup,
  pegarChamado,
  darkMode
}) => (
  <div className={`flex items-center justify-between p-6 border-t ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
    <button
      onClick={fecharPopup}
      className={`px-6 py-2 border rounded-lg ${darkMode ? 'border-gray-500 text-gray-300 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
    >
      Cancelar
    </button>
    <div className="flex space-x-3">
      {tipo === 'detalhes' && (
        <>
          {!dados?.retorno && (
            <button
              type="button"
              onClick={() => pegarChamado(dados, linha!)}
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
      {tipo === 'novo' && (
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Criar Chamado
        </button>
      )}
    </div>
  </div>
);

export default PopupFooter; 