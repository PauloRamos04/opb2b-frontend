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
import PopupHeader from './PopupHeader';
import PopupDetalhesForm from './PopupDetalhesForm';
// import PopupAndamentos from './PopupAndamentos'; // REMOVIDO
import PopupNovoForm from './PopupNovoForm';
import PopupFooter from './PopupFooter';

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
        <PopupHeader
          tipo={popup.tipo}
          dados={popup.dados}
          fecharPopup={fecharPopup}
          renderStatusBadge={renderStatusBadge}
          renderCarteiraBadge={renderCarteiraBadge}
          darkMode={darkMode}
        />
        <div className="p-6">
          {popup.tipo === 'detalhes' && popup.dados && (
            <>
              <PopupDetalhesForm
                dados={popup.dados}
                novoAndamento={novoAndamento}
                setNovoAndamento={setNovoAndamento}
                adicionarAndamento={adicionarAndamento}
                renderStatusBadge={renderStatusBadge}
                renderCarteiraBadge={renderCarteiraBadge}
                darkMode={darkMode}
              />
              {/* O COMPONENTE ABAIXO FOI REMOVIDO */}
              {/* <PopupAndamentos
                descricao={popup.dados?.descricao || ''}
                novoAndamento={novoAndamento}
                setNovoAndamento={setNovoAndamento}
                adicionarAndamento={adicionarAndamento}
                darkMode={darkMode}
              /> */}
            </>
          )}
          {popup.tipo === 'novo' && (
            <PopupNovoForm
              formValues={formValues}
              setFormValues={setFormValues}
              darkMode={darkMode}
            />
          )}
        </div>
        <PopupFooter
          tipo={popup.tipo}
          dados={popup.dados}
          linha={popup.linha}
          fecharPopup={fecharPopup}
          salvarAlteracoesPopup={salvarAlteracoesPopup}
          pegarChamado={pegarChamado}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default Popup;