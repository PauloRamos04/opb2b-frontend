import { useMemo } from 'react';
import { INITIAL_FILTER_STATE } from '@/config';

interface UseAdvancedFiltersProps {
  filtrosAvancados: any;
  setFiltrosAvancados: React.Dispatch<React.SetStateAction<any>>;
  colunasVisiveis: Record<string, boolean>;
  setColunasVisiveis: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const useAdvancedFilters = ({ filtrosAvancados, setFiltrosAvancados, colunasVisiveis, setColunasVisiveis }: UseAdvancedFiltersProps) => {
  const limparFiltros = () => {
    setFiltrosAvancados({
      ...INITIAL_FILTER_STATE,
      status: [],
      carteira: [],
      operador: [],
      tags: []
    });
  };

  const adicionarFiltroStatus = (status: string) => {
    if (!filtrosAvancados.status.includes(status)) {
      setFiltrosAvancados((prev: any) => ({
        ...prev,
        status: [...prev.status, status]
      }));
    }
  };

  const removerFiltroStatus = (status: string) => {
    setFiltrosAvancados((prev: any) => ({
      ...prev,
      status: prev.status.filter((s: string) => s !== status)
    }));
  };

  const adicionarFiltroCarteira = (carteira: string) => {
    if (!filtrosAvancados.carteira.includes(carteira)) {
      setFiltrosAvancados((prev: any) => ({
        ...prev,
        carteira: [...prev.carteira, carteira]
      }));
    }
  };

  const removerFiltroCarteira = (carteira: string) => {
    setFiltrosAvancados((prev: any) => ({
      ...prev,
      carteira: prev.carteira.filter((c: string) => c !== carteira)
    }));
  };

  const adicionarFiltroOperador = (operador: string) => {
    if (!filtrosAvancados.operador.includes(operador)) {
      setFiltrosAvancados((prev: any) => ({
        ...prev,
        operador: [...prev.operador, operador]
      }));
    }
  };

  const removerFiltroOperador = (operador: string) => {
    setFiltrosAvancados((prev: any) => ({
      ...prev,
      operador: prev.operador.filter((c: string) => c !== operador)
    }));
  };

  const toggleAllColumns = (visible: boolean) => {
    const updatedColumns = Object.keys(colunasVisiveis).reduce((acc, col) => {
      acc[col] = visible;
      return acc;
    }, {} as Record<string, boolean>);
    setColunasVisiveis(updatedColumns);
  };

  const filtrosAtivosCount = useMemo(() => {
    return Object.entries(filtrosAvancados).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
  }, [filtrosAvancados]);

  const colunasVisiveisCount = useMemo(() => {
    return Object.values(colunasVisiveis).filter(Boolean).length;
  }, [colunasVisiveis]);

  return {
    limparFiltros,
    adicionarFiltroStatus,
    removerFiltroStatus,
    adicionarFiltroCarteira,
    removerFiltroCarteira,
    adicionarFiltroOperador,
    removerFiltroOperador,
    toggleAllColumns,
    filtrosAtivosCount,
    colunasVisiveisCount
  };
}; 