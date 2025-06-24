"use client";

import React, { useMemo, useState } from "react";
import { useSpreadsheet } from "@/contexts/SpreadsheetContext";
import Layout from "@/components/Layout";
import { COLUMN_INDICES, DATA_START_ROW } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";

const COLUNAS_OBRIGATORIAS = [
  { key: "OPERADOR", label: "Operador" },
  { key: "STATUS", label: "Status" },
  { key: "CARTEIRA", label: "Carteira" },
  { key: "CIDADE", label: "Cidade" },
  { key: "CLIENTE", label: "Cliente" },
  { key: "ASSUNTO", label: "Assunto" },
  { key: "Histórico", label: "Histórico" },
  { key: "DESCRIÇÃO", label: "Descrição" },
];

function getUltimoRelato(historico: string) {
  if (!historico) return "";
  // Separa por quebras de linha e pega o último não vazio
  const partes = historico.split(/\n|\r|\r\n|\n\n/).map(s => s.trim()).filter(Boolean);
  return partes.length ? partes[partes.length - 1] : historico;
}

function getBreveDescricao(descricao: string) {
  if (!descricao) return "";
  const linhas = descricao.split(/\n|\r|\r\n|\n\n/).map(s => s.trim()).filter(Boolean);
  return linhas.slice(-3).join(" ").slice(0, 200); // últimas 3 linhas ou 200 caracteres
}

const RelatoriosPage: React.FC = () => {
  const { data, loading, error, refreshData } = useSpreadsheet();
  const { darkMode } = useTheme();
  const [operadorFiltro, setOperadorFiltro] = useState<string>("");
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [carteiraFiltro, setCarteiraFiltro] = useState<string>("");
  const [cidadeFiltro, setCidadeFiltro] = useState<string>("");
  const [clienteFiltro, setClienteFiltro] = useState<string>("");
  const [assuntoFiltro, setAssuntoFiltro] = useState<string>("");
  const [showReport, setShowReport] = useState<boolean>(false);
  const [relatorioTexto, setRelatorioTexto] = useState<string>("");

  // Todos os chamados visíveis
  const chamados = useMemo(() => {
    if (!data || data.length < DATA_START_ROW) return [];
    return data.slice(DATA_START_ROW);
  }, [data]);

  // Filtros opcionais
  const chamadosFiltrados = useMemo(() => {
    return chamados.filter(row => {
      if (operadorFiltro && row[COLUMN_INDICES.OPERADOR] !== operadorFiltro) return false;
      if (statusFiltro && row[COLUMN_INDICES.STATUS] !== statusFiltro) return false;
      if (carteiraFiltro && row[COLUMN_INDICES.CARTEIRA] !== carteiraFiltro) return false;
      if (cidadeFiltro && row[COLUMN_INDICES.CIDADE] !== cidadeFiltro) return false;
      if (clienteFiltro && row[COLUMN_INDICES.CLIENTE] !== clienteFiltro) return false;
      if (assuntoFiltro && row[COLUMN_INDICES.ASSUNTO] !== assuntoFiltro) return false;
      return true;
    });
  }, [chamados, operadorFiltro, statusFiltro, carteiraFiltro, cidadeFiltro, clienteFiltro, assuntoFiltro]);

  // Valores únicos para filtros
  function getUnicos(colKey: string) {
    if (!chamados.length) return [];
    return Array.from(new Set(chamados.map(row => row[COLUMN_INDICES[colKey as keyof typeof COLUMN_INDICES]] || ""))).filter(Boolean);
  }

  // Gerar relatório curto
  function gerarRelatorio() {
    if (!chamadosFiltrados.length) {
      setRelatorioTexto("Nenhum chamado encontrado.");
      setShowReport(true);
      return;
    }
    let texto = "";
    chamadosFiltrados.forEach((row) => {
      const operador = row[COLUMN_INDICES.OPERADOR] || "Sem operador";
      const status = row[COLUMN_INDICES.STATUS] || "Sem status";
      const historico = row[COLUMN_INDICES["Histórico"]] || "";
      const descricao = row[COLUMN_INDICES["DESCRIÇÃO"]] || "";
      const breveDescricao = getBreveDescricao(descricao);
      const ultimoRelato = getUltimoRelato(historico);
      texto += `Operador: ${operador} | Status: ${status}\nHistórico: ${ultimoRelato}\nDescrição: ${breveDescricao}\n\n`;
    });
    setRelatorioTexto(texto.trim());
    setShowReport(true);
  }

  function copiarRelatorio() {
    navigator.clipboard.writeText(relatorioTexto);
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className={`text-2xl font-bold mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>Relatório Diário de Chamados</h1>
        <form
          className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
          onSubmit={e => { e.preventDefault(); gerarRelatorio(); }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="operador" className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Operador:</label>
            <select
              id="operador"
              value={operadorFiltro}
              onChange={e => setOperadorFiltro(e.target.value)}
              className={`border rounded px-3 py-2 bg-transparent ${darkMode ? "text-white border-gray-600 bg-gray-800" : "text-gray-900 border-gray-300 bg-white"}`}
            >
              <option value="">Todos</option>
              {getUnicos("OPERADOR").map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="status" className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Status:</label>
            <select
              id="status"
              value={statusFiltro}
              onChange={e => setStatusFiltro(e.target.value)}
              className={`border rounded px-3 py-2 bg-transparent ${darkMode ? "text-white border-gray-600 bg-gray-800" : "text-gray-900 border-gray-300 bg-white"}`}
            >
              <option value="">Todos</option>
              {getUnicos("STATUS").map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="carteira" className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Carteira:</label>
            <select
              id="carteira"
              value={carteiraFiltro}
              onChange={e => setCarteiraFiltro(e.target.value)}
              className={`border rounded px-3 py-2 bg-transparent ${darkMode ? "text-white border-gray-600 bg-gray-800" : "text-gray-900 border-gray-300 bg-white"}`}
            >
              <option value="">Todas</option>
              {getUnicos("CARTEIRA").map(ca => <option key={ca} value={ca}>{ca}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cidade" className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Cidade:</label>
            <select
              id="cidade"
              value={cidadeFiltro}
              onChange={e => setCidadeFiltro(e.target.value)}
              className={`border rounded px-3 py-2 bg-transparent ${darkMode ? "text-white border-gray-600 bg-gray-800" : "text-gray-900 border-gray-300 bg-white"}`}
            >
              <option value="">Todas</option>
              {getUnicos("CIDADE").map(ci => <option key={ci} value={ci}>{ci}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cliente" className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Cliente:</label>
            <select
              id="cliente"
              value={clienteFiltro}
              onChange={e => setClienteFiltro(e.target.value)}
              className={`border rounded px-3 py-2 bg-transparent ${darkMode ? "text-white border-gray-600 bg-gray-800" : "text-gray-900 border-gray-300 bg-white"}`}
            >
              <option value="">Todos</option>
              {getUnicos("CLIENTE").map(cl => <option key={cl} value={cl}>{cl}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="assunto" className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Assunto:</label>
            <select
              id="assunto"
              value={assuntoFiltro}
              onChange={e => setAssuntoFiltro(e.target.value)}
              className={`border rounded px-3 py-2 bg-transparent ${darkMode ? "text-white border-gray-600 bg-gray-800" : "text-gray-900 border-gray-300 bg-white"}`}
            >
              <option value="">Todos</option>
              {getUnicos("ASSUNTO").map(as => <option key={as} value={as}>{as}</option>)}
            </select>
          </div>
          <div className="flex md:col-span-3 justify-end gap-2 mt-2">
            <button type="submit" className="px-6 py-2 font-semibold bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">Gerar relatório</button>
          </div>
        </form>
        {loading && <p>Carregando chamados...</p>}
        {error && <p className="text-red-500">Erro: {error}</p>}
        {showReport && (
          <div className={`mt-8 p-6 rounded-2xl shadow-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-green-400" : "text-green-700"}`}>Relatório</h2>
            <textarea
              className={`w-full h-40 border rounded-lg p-3 mb-4 font-mono text-base resize-vertical ${darkMode ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-gray-100 text-gray-800 border-gray-300"}`}
              value={relatorioTexto}
              readOnly
            />
            <div className="flex gap-2 justify-end">
              <button onClick={copiarRelatorio} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Copiar relatório</button>
              <button onClick={() => setShowReport(false)} className="px-5 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition">Fechar</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RelatoriosPage; 