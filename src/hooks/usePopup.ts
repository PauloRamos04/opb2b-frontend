import { useState } from 'react';

export interface PopupData {
  aberto: boolean;
  tipo: 'detalhes' | 'novo' | '';
  dados: any;
  linha: number | null;
}

export const usePopup = () => {
  const [popup, setPopup] = useState<PopupData>({ aberto: false, tipo: '', dados: null, linha: null });

  const abrirPopup = (tipo: 'detalhes' | 'novo', dados: any = null, linha: number | null = null) => {
    setPopup({ aberto: true, tipo, dados, linha });
  };

  const fecharPopup = () => {
    setPopup({ aberto: false, tipo: '', dados: null, linha: null });
  };

  return {
    popup,
    setPopup,
    abrirPopup,
    fecharPopup
  };
}; 