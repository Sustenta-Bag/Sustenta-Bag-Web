/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import SecondaryButton from "@/components/button/SecondaryButton";
import PrimaryButton from "@/components/button/PrimaryButton";
import AlertComponent from "@/components/alertComponent/Alert";
import ModalComponent from "@/components/Modal/ModalComponent";
import { Pedido, pedidosService } from "@/services/pedidosService";

interface NavLink {
  text: string;
  href: string;
  icon?: string;
  position?: "left" | "right";
}

const PedidosPage = () => {
  const [activeTab, setActiveTab] = useState<
    "todos" | "pendentes" | "aceitos" | "concluidos"
  >("todos");
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8; // Ajustado para melhor visualização em grid

  // Estado para controlar o modal
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(
    null
  );

  // Estado para estatísticas
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    pendentes: 0,
    aceitos: 0,
    concluidos: 0,
    recusados: 0,
    valorTotal: 0,
  });

  const [alert, setAlert] = useState({
    visible: false,
    texto: "",
    tipo: "success" as "success" | "info" | "warning" | "error",
  });

  // Links da Navbar com ícones
  const navLinks: NavLink[] = [
    { text: "Página Inicial", href: "/private/homePage", icon: "bx-home" },
    { text: "Pedidos", href: "/private/pedidos", icon: "bx-package" },
    {
      text: "Cadastro de Sacolas",
      href: "/private/cadastro-sacolas",
      icon: "bx-shopping-bag",
    },
    {
      text: "Configuração",
      href: "/private/configuracao",
      icon: "bx-cog",
      position: "right",
    },
  ];

  // Carregar todos os pedidos e estatísticas inicialmente
  useEffect(() => {
    // Consumindo diretamente o array do service
    const todosPedidos = pedidosService.pedidosMock;
    setPedidos(todosPedidos);
    aplicarFiltros(todosPedidos);

    // Carregar estatísticas
    setEstatisticas(pedidosService.obterEstatisticas());
  }, []);

  // Monitorar alterações nos filtros
  useEffect(() => {
    aplicarFiltros(pedidos);
  }, [activeTab, busca, filtroData, paginaAtual, pedidos]);

  // Função para aplicar filtros aos pedidos
  const aplicarFiltros = (pedidosBase: Pedido[]) => {
    let resultado = [...pedidosBase];

    // Filtrar por status
    if (activeTab !== "todos") {
      const statusMap: Record<
        "todos" | "pendentes" | "aceitos" | "concluidos",
        Pedido["status"] | null
      > = {
        todos: null,
        pendentes: "pendente",
        aceitos: "aceito",
        concluidos: "concluido",
      };
      const statusFiltro = statusMap[activeTab];
      if (statusFiltro) {
        resultado = resultado.filter((p) => p.status === statusFiltro);
      }
    }

    // Filtrar por busca
    if (busca.trim()) {
      const termoBusca = busca.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.id.toLowerCase().includes(termoBusca) ||
          p.cliente.toLowerCase().includes(termoBusca) ||
          p.produto.toLowerCase().includes(termoBusca)
      );
    }

    // Filtrar por data
    if (filtroData) {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      resultado = resultado.filter((p) => {
        const dataPedido = converterDataParaDate(p.data);

        switch (filtroData) {
          case "hoje":
            return formatarData(dataPedido) === formatarData(hoje);
          case "semana":
            return dataPedido >= inicioSemana;
          case "mes":
            return dataPedido >= inicioMes;
          default:
            return true;
        }
      });
    }

    setPedidosFiltrados(resultado);
    setPaginaAtual(1); // Resetar para primeira página ao aplicar filtros
  };

  // Converter string de data (DD/MM/YYYY) para objeto Date
  const converterDataParaDate = (dataString: string): Date => {
    const partes = dataString.split("/");
    return new Date(
      Number(partes[2]),
      Number(partes[1]) - 1,
      Number(partes[0])
    );
  };

  // Formatar Date para string de comparação (YYYY-MM-DD)
  const formatarData = (data: Date): string => {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(data.getDate()).padStart(2, "0")}`;
  };

  // Filtrar por status
  const handleTabChange = (
    tab: "todos" | "pendentes" | "aceitos" | "concluidos"
  ) => {
    setActiveTab(tab);
  };

  // Funções para abrir modal com detalhes do pedido
  const handleVisualizarPedido = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  // Funções para mudança de status
  const handleAceitarPedido = (id: string) => {
    const pedidoAtualizado = pedidosService.atualizarStatus(id, "aceito");
    if (pedidoAtualizado) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "aceito" } : p))
      );

      // Se o pedido selecionado no modal for o que foi atualizado, atualize-o também
      if (pedidoSelecionado?.id === id) {
        setPedidoSelecionado({ ...pedidoSelecionado, status: "aceito" });
      }

      // Atualizar estatísticas
      setEstatisticas(pedidosService.obterEstatisticas());

      setAlert({
        visible: true,
        texto: `Pedido ${id} aceito com sucesso!`,
        tipo: "success",
      });
    }
  };

  const handleConcluirPedido = (id: string) => {
    const pedidoAtualizado = pedidosService.atualizarStatus(id, "concluido");
    if (pedidoAtualizado) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "concluido" } : p))
      );

      // Se o pedido selecionado no modal for o que foi atualizado, atualize-o também
      if (pedidoSelecionado?.id === id) {
        setPedidoSelecionado({ ...pedidoSelecionado, status: "concluido" });
      }

      // Atualizar estatísticas
      setEstatisticas(pedidosService.obterEstatisticas());

      setAlert({
        visible: true,
        texto: `Pedido ${id} concluído com sucesso!`,
        tipo: "success",
      });
    }
  };

  const handleRecusarPedido = (id: string) => {
    const pedidoAtualizado = pedidosService.atualizarStatus(id, "recusado");
    if (pedidoAtualizado) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "recusado" } : p))
      );

      // Se o pedido selecionado no modal for o que foi atualizado, atualize-o também
      if (pedidoSelecionado?.id === id) {
        setPedidoSelecionado({ ...pedidoSelecionado, status: "recusado" });
      }

      // Atualizar estatísticas
      setEstatisticas(pedidosService.obterEstatisticas());

      setAlert({
        visible: true,
        texto: `Pedido ${id} recusado.`,
        tipo: "info",
      });

      // Fechar modal após recusar
      setModalOpen(false);
    }
  };

  // Fechar alerta
  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  // Paginação
  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  // Renderização de botões de ação baseados no status do pedido
  const renderizarAcoes = (pedido: Pedido) => {
    switch (pedido.status) {
      case "pendente":
        return (
          <div className="flex space-x-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAceitarPedido(pedido.id);
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
            >
              <i className="bx bx-check mr-1"></i> Aceitar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRecusarPedido(pedido.id);
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
            >
              <i className="bx bx-x mr-1"></i> Recusar
            </button>
          </div>
        );
      case "aceito":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleConcluirPedido(pedido.id);
            }}
            className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
          >
            <i className="bx bx-package mr-1"></i> Concluir
          </button>
        );
      default:
        return null;
    }
  };

  // Renderizar botões de ação para o modal
  const renderizarAcoesModal = () => {
    if (!pedidoSelecionado) return null;

    switch (pedidoSelecionado.status) {
      case "pendente":
        return (
          <>
            <SecondaryButton
              onClick={() => handleRecusarPedido(pedidoSelecionado.id)}
              className="bg-red-50 text-red-600 hover:bg-red-100"
            >
              Recusar Pedido
            </SecondaryButton>
            <PrimaryButton
              onClick={() => handleAceitarPedido(pedidoSelecionado.id)}
            >
              Aceitar Pedido
            </PrimaryButton>
          </>
        );
      case "aceito":
        return (
          <PrimaryButton
            onClick={() => handleConcluirPedido(pedidoSelecionado.id)}
          >
            Marcar como Concluído
          </PrimaryButton>
        );
      case "concluido":
      case "recusado":
      default:
        return (
          <PrimaryButton onClick={() => setModalOpen(false)}>
            Fechar
          </PrimaryButton>
        );
    }
  };

  // Renderizar badge de status
  const renderizarBadgeStatus = (status: Pedido["status"]) => {
    switch (status) {
      case "pendente":
        return (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            Pendente
          </span>
        );
      case "aceito":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
            Aceito
          </span>
        );
      case "concluido":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
            Concluído
          </span>
        );
      case "recusado":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
            Recusado
          </span>
        );
    }
  };

  // Formatar valor para Real
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Alerta para feedback de ações */}
          {alert.visible && (
            <div className="fixed top-20 right-4 z-50 w-auto max-w-sm">
              <AlertComponent
                texto={alert.texto}
                tipo={alert.tipo}
                onClose={handleCloseAlert}
              />
            </div>
          )}

          {/* Cabeçalho e estatísticas */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#1E1E1E] flex items-center">
              <i className="bx bx-package text-[#037335] text-3xl mr-2"></i>
              Gerenciamento de Pedidos
            </h1>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#037335]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    Total de Pedidos
                  </span>
                  <span className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="bx bx-package text-[#037335]"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2">{estatisticas.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Valor total: {formatarMoeda(estatisticas.valorTotal)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Pendentes</span>
                  <span className="bg-amber-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="bx bx-time text-amber-600"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {estatisticas.pendentes}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Aguardando aprovação
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Em Processo</span>
                  <span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="bx bx-cycling text-blue-600"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {estatisticas.aceitos}
                </p>
                <p className="text-xs text-gray-500 mt-1">Em preparação</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Concluídos</span>
                  <span className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <i className="bx bx-check-circle text-green-600"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {estatisticas.concluidos}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Entregues ao cliente
                </p>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Campo de busca */}
                <div className="relative w-full md:w-64 flex-grow lg:flex-grow-0">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="bx bx-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                  />
                </div>

                {/* Filtro de data */}
                <div className="relative w-full md:w-48 flex-grow lg:flex-grow-0">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="bx bx-calendar"></i>
                  </span>
                  <select
                    className="w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                  >
                    <option value="">Todas as datas</option>
                    <option value="hoje">Hoje</option>
                    <option value="semana">Esta semana</option>
                    <option value="mes">Este mês</option>
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <i className="bx bx-chevron-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs para filtragem por status */}
          <div className="mb-6 bg-white rounded-t-xl shadow-sm">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => handleTabChange("todos")}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "todos"
                    ? "border-[#037335] text-[#037335] bg-green-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className="bx bx-list-ul mr-1.5"></i> Todos
              </button>
              <button
                onClick={() => handleTabChange("pendentes")}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "pendentes"
                    ? "border-amber-500 text-amber-700 bg-amber-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className="bx bx-time mr-1.5"></i> Pendentes
              </button>
              <button
                onClick={() => handleTabChange("aceitos")}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "aceitos"
                    ? "border-blue-500 text-blue-700 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className="bx bx-cycling mr-1.5"></i> Em Processo
              </button>
              <button
                onClick={() => handleTabChange("concluidos")}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "concluidos"
                    ? "border-green-500 text-green-700 bg-green-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className="bx bx-check-circle mr-1.5"></i> Concluídos
              </button>
            </div>
          </div>

          {/* Grid de cartões de pedidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {pedidosPaginados.length > 0 ? (
              pedidosPaginados.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleVisualizarPedido(pedido)}
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">
                        {pedido.id}
                      </h3>
                      {renderizarBadgeStatus(pedido.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      <i className="bx bx-user text-gray-400 mr-1.5"></i>
                      {pedido.cliente}
                    </p>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      <i className="bx bx-shopping-bag text-gray-400 mr-1.5"></i>
                      {pedido.produto}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <i className="bx bx-calendar text-gray-400 mr-1.5"></i>
                      {pedido.data}
                    </p>
                    <p className="text-sm font-medium text-[#037335]">
                      <i className="bx bx-money text-gray-400 mr-1.5"></i>
                      {formatarMoeda(pedido.valor)}
                    </p>
                  </div>
                  <div
                    className="px-4 pb-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {renderizarAcoes(pedido)}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <i className="bx bx-search text-gray-400 text-3xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-500">
                  Não encontramos pedidos com os filtros aplicados. Tente
                  ajustar os critérios de busca.
                </p>
              </div>
            )}
          </div>

          {/* Paginação */}
          {pedidosFiltrados.length > itensPorPagina && (
            <div className="flex justify-center my-8">
              <nav className="flex items-center justify-center bg-white px-4 py-3 rounded-lg shadow-sm">
                <button
                  onClick={() => setPaginaAtual(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  className={`p-2 rounded-full ${
                    paginaAtual === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="bx bx-chevron-left text-xl"></i>
                </button>

                {Array.from({ length: Math.min(totalPaginas, 5) }).map(
                  (_, idx) => {
                    // Lógica para mostrar páginas próximas à atual
                    let pageNum;
                    if (totalPaginas <= 5) {
                      pageNum = idx + 1;
                    } else if (paginaAtual <= 3) {
                      pageNum = idx + 1;
                    } else if (paginaAtual >= totalPaginas - 2) {
                      pageNum = totalPaginas - 4 + idx;
                    } else {
                      pageNum = paginaAtual - 2 + idx;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPaginaAtual(pageNum)}
                        className={`w-10 h-10 mx-1 rounded-full ${
                          paginaAtual === pageNum
                            ? "bg-[#037335] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() => setPaginaAtual(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                  className={`p-2 rounded-full ${
                    paginaAtual === totalPaginas
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className="bx bx-chevron-right text-xl"></i>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Modal para visualização detalhada e ações de pedidos */}
      <ModalComponent
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        title={`Detalhes do Pedido ${pedidoSelecionado?.id || ""}`}
        maxWidth="max-w-xl"
        footer={renderizarAcoesModal()}
      >
        {pedidoSelecionado ? (
          <div className="space-y-6">
            {/* Header do modal com status prominente */}
            <div className="text-center pb-4 border-b border-gray-100">
              {renderizarBadgeStatus(pedidoSelecionado.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
                    Cliente
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {pedidoSelecionado.cliente}
                  </p>
                  {pedidoSelecionado.telefone && (
                    <p className="text-gray-600 text-sm mt-1">
                      <i className="bx bx-phone mr-1.5"></i>
                      {pedidoSelecionado.telefone}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
                    Produto
                  </h3>
                  <p className="text-gray-800">{pedidoSelecionado.produto}</p>
                  {pedidoSelecionado.quantidadeSacolas && (
                    <p className="text-gray-600 text-sm mt-1">
                      <i className="bx bx-package mr-1.5"></i>
                      {pedidoSelecionado.quantidadeSacolas} unidades
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
                    Data do Pedido
                  </h3>
                  <p className="text-gray-800">
                    <i className="bx bx-calendar mr-1.5"></i>
                    {pedidoSelecionado.data}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
                    Valor
                  </h3>
                  <p className="text-xl font-semibold text-[#037335]">
                    {formatarMoeda(pedidoSelecionado.valor)}
                  </p>
                </div>
              </div>
            </div>

            {pedidoSelecionado.endereco && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
                  Endereço de Entrega
                </h3>
                <p className="text-gray-800">
                  <i className="bx bx-map mr-1.5 text-gray-400"></i>
                  {pedidoSelecionado.endereco}
                </p>
              </div>
            )}

            {pedidoSelecionado.observacoes && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
                  Observações
                </h3>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
                  {pedidoSelecionado.observacoes}
                </p>
              </div>
            )}

            {/* Timeline de status */}
            {pedidoSelecionado.historico && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-medium uppercase text-gray-500 mb-4">
                  Histórico de Status
                </h3>
                <div className="space-y-4">
                  {pedidoSelecionado.historico?.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 h-full w-6 relative">
                        <div className="absolute h-full w-0.5 bg-gray-200 left-1/2 -translate-x-1/2 top-0"></div>
                        <div className="absolute h-3 w-3 rounded-full bg-green-500 top-1.5 left-1/2 -translate-x-1/2 ring-4 ring-white"></div>
                      </div>
                      <div className="ml-4 pb-5">
                        <p className="text-sm font-medium text-gray-800">
                          {item.status}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.data} às {item.hora}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <i className="bx bx-loader-alt bx-spin text-3xl text-gray-300 mb-2"></i>
            <p>Carregando detalhes do pedido...</p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
};

export default PedidosPage;
