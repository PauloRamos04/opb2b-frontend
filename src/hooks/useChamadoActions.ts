import { useSpreadsheet } from '@/contexts/SpreadsheetContext';
import { chamadoService } from '@/services/chamado.service';
import { COLUMN_INDICES, FIELD_MAPPING } from '@/constants';
import { usePopup } from './usePopup';
import { toast } from 'react-hot-toast';

export const useChamadoActions = (
  popup: any,
  setPopup: Function,
  formValues: any,
  setFormValues: Function,
  novoAndamento: string,
  setNovoAndamento: Function,
  fecharPopup: Function
) => {
  const { refreshData } = useSpreadsheet();

  const pegarChamado = async (dadosRow: any, actualRowIndex: number) => {
    try {
      const operador = JSON.parse(localStorage.getItem('auth_user') || '{}')?.operador || 'DESCONHECIDO';
      await chamadoService.pegarChamado({ linha: actualRowIndex, operador });
      toast.success('✅ Chamado #${dadosRow.historico} pego com sucesso!');
      await refreshData();
    } catch (error) {
      console.error('❌ Erro ao pegar chamado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`❌ Erro ao pegar chamado: ${errorMessage}`);
    }
  };

  const adicionarAndamento = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!novoAndamento.trim()) {
      toast.error('Por favor, digite um andamento antes de salvar.');
      return;
    }

    try {
      const rowIndex = popup.linha;
      if (rowIndex !== null) {
        const valorAtual = popup.dados?.descricao || '';
        const operador = JSON.parse(localStorage.getItem('auth_user') || '{}')?.operador || 'DESCONHECIDO';
        const result = await chamadoService.adicionarAndamento({
          linha: rowIndex,
          andamento: novoAndamento,
          valorAtual: valorAtual,
          operador: operador
        });

        const novoValor = result.data.novoValor;

        setPopup((prev: any) => ({
          ...prev,
          dados: { ...prev.dados, descricao: novoValor }
        }));
        setFormValues((prev: any) => ({
          ...prev,
          descricao: novoValor
        }));
        setNovoAndamento('');
        toast.success('Andamento adicionado com sucesso!');
      } else {
        throw new Error('Linha não encontrada');
      }
    } catch (error) {
      console.error('Erro ao adicionar andamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao salvar: ${errorMessage}`);
    }
  };

  const salvarAlteracoesPopup = async () => {
    try {
      if (!popup.dados || popup.linha === null) {
        throw new Error('Dados do popup não encontrados');
      }

      const form = document.querySelector('[data-popup-form]') as HTMLFormElement;
      if (!form) {
        throw new Error('Formulário não encontrado');
      }

      const formData = new FormData(form);
      const updates: Array<{ row: number, col: number, value: string }> = [];

      Object.entries(FIELD_MAPPING).forEach(([fieldName, columnName]) => {
        let value = formData.get(fieldName) as string;

        if (fieldName === 'descricao') {
          value = formValues.descricao || popup.dados.descricao || '';
        }

        if (value !== null) {
          const colIndex = COLUMN_INDICES[columnName as keyof typeof COLUMN_INDICES];
          updates.push({
            row: popup.linha!,
            col: colIndex,
            value: value
          });
        }
      });

      const result = await chamadoService.salvarAlteracoes(updates);
      
      if (result.success) {
        toast.success('✅ Todas as alterações foram salvas com sucesso!');
        fecharPopup();
        await refreshData();
      } else {
        throw new Error(result.message || 'Falha ao salvar as alterações');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar alterações:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`❌ Erro ao salvar: ${errorMessage}`);
    }
  };

  return {
    pegarChamado,
    adicionarAndamento,
    salvarAlteracoesPopup
  };
}; 