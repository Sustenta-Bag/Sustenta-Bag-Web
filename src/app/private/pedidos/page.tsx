/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import SecondaryButton from "@/components/button/SecondaryButton";
import PrimaryButton from "@/components/button/PrimaryButton";
import AlertComponent from "@/components/alertComponent/Alert";
import ModalComponent from "@/components/Modal/ModalComponent";
import { Pedido, pedidosService } from "@/services/pedidosService";
import {
  converterDataParaDate,
  formatarDataParaComparacao,
  formatarMoeda,
} from "@/utils/formatters"; // Note: formatarMoeda é usado dentro dos componentes agora

// Novos componentes importados
import { Card } from "@/components/card/Card";
import OrderFilters from "@/components/orderFilters/OrderFilters";
import StatusTabs, { ActiveTabType } from "@/components/statusTabs/StatusTabs";
import OrderGrid from "@/components/orderGrid/OrderGrid";
import PaginationControls from "@/components/paginationControls/PaginationControls";
import OrderDetailModalContent from "@/components/orderDetailModalContent/OrderDetailModalContent";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { MdPendingActions } from "react-icons/md";
import { CiViewList } from "react-icons/ci";

interface NavLink {
  text: string;
  href: string;
  icon?: string;
  position?: "left" | "right";
}

const PedidosPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("todos");
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(
    null
  );

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

  useEffect(() => {
    const todosPedidos = pedidosService.pedidosMock;
    setPedidos(todosPedidos);
    // aplicarFiltros será chamado pelo useEffect abaixo ao setar 'pedidos'
    setEstatisticas(pedidosService.obterEstatisticas());
  }, []);

  useEffect(() => {
    aplicarFiltros(pedidos);
  }, [activeTab, busca, filtroData, paginaAtual, pedidos]); // paginaAtual não deve refiltrar, mas sim re-paginar

  // Novo useEffect para resetar a página ao mudar filtros
  useEffect(() => {
    setPaginaAtual(1); // Resetar para primeira página ao aplicar filtros que não sejam a página
  }, [activeTab, busca, filtroData, pedidos]);

  const aplicarFiltros = (pedidosBase: Pedido[]) => {
    let resultado = [...pedidosBase];

    if (activeTab !== "todos") {
      const statusMap: Record<ActiveTabType, Pedido["status"] | null> = {
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

    if (busca.trim()) {
      const termoBusca = busca.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.id.toLowerCase().includes(termoBusca) ||
          p.cliente.toLowerCase().includes(termoBusca) ||
          p.produto.toLowerCase().includes(termoBusca)
      );
    }

    if (filtroData) {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      resultado = resultado.filter((p) => {
        const dataPedido = converterDataParaDate(p.data);
        switch (filtroData) {
          case "hoje":
            return (
              formatarDataParaComparacao(dataPedido) ===
              formatarDataParaComparacao(hoje)
            );
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
    // setPaginaAtual(1); // Movido para o useEffect dedicado
  };

  const handleTabChange = (tab: ActiveTabType) => setActiveTab(tab);
  const handleBuscaChange = (value: string) => setBusca(value);
  const handleFiltroDataChange = (value: string) => setFiltroData(value);

  const handleVisualizarPedido = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setModalOpen(true);
  };

  const atualizarPedidoLocalmente = (
    id: string,
    novoStatus: Pedido["status"]
  ) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: novoStatus,
              historico:
                pedidosService.adicionarAoHistorico(p.id, novoStatus) ?? [],
            }
          : p
      )
    );

    if (pedidoSelecionado?.id === id) {
      setPedidoSelecionado((prev) =>
        prev
          ? {
              ...prev,
              status: novoStatus,
              historico:
                pedidosService.adicionarAoHistorico(prev.id, novoStatus) ?? [],
            }
          : null
      );
    }

    setEstatisticas(pedidosService.obterEstatisticas());
  };

  const handleAceitarPedido = (id: string) => {
    const pedidoAtualizado = pedidosService.atualizarStatus(id, "aceito");
    if (pedidoAtualizado) {
      atualizarPedidoLocalmente(id, "aceito");
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
      atualizarPedidoLocalmente(id, "concluido");
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
      atualizarPedidoLocalmente(id, "recusado");
      setAlert({
        visible: true,
        texto: `Pedido ${id} recusado.`,
        tipo: "info",
      });
      if (pedidoSelecionado?.id === id) {
        // Fecha o modal se o pedido recusado era o que estava aberto
        setModalOpen(false);
      }
    }
  };

  const handleCloseAlert = () =>
    setAlert((prev) => ({ ...prev, visible: false }));

  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

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
      default:
        return (
          <PrimaryButton onClick={() => setModalOpen(false)}>
            Fechar
          </PrimaryButton>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {alert.visible && (
            <div className="fixed top-20 right-4 z-50 w-auto max-w-sm">
              <AlertComponent
                texto={alert.texto}
                tipo={alert.tipo}
                onClose={handleCloseAlert}
              />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#1E1E1E] flex items-center">
              <i className="bx bx-package text-[#037335] text-3xl mr-2"></i>
              Gerenciamento de Pedidos
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card
                titulo="Total de Pedidos"
                valor={estatisticas.total}
                descricao={`Valor total: ${formatarMoeda(
                  estatisticas.valorTotal
                )}`}
                corBorda="border-[#037335]"
                corIconeBg="bg-green-100"
                icone={<CiViewList className="text-zinc-800 text-2xl" />}
              />
              <Card
                titulo="Pendentes"
                valor={estatisticas.pendentes}
                descricao="Aguardando aprovação"
                corBorda="border-amber-500"
                corIconeBg="bg-amber-100"
                icone={<MdPendingActions className="text-zinc-800 text-2xl" />}
              />
              <Card
                titulo="Em Processo"
                valor={estatisticas.aceitos}
                descricao="Em preparação"
                corBorda="border-blue-500"
                corIconeBg="bg-blue-100"
                icone={<BiLoaderCircle className="text-zinc-800 text-2xl" />}
              />
              <Card
                titulo="Concluídos"
                valor={estatisticas.concluidos}
                descricao="Entregues ao cliente"
                corBorda="border-green-500"
                corIconeBg="bg-green-100"
                icone={
                  <AiOutlineCheckCircle className="text-zinc-800 text-2xl" />
                }
              />
            </div>
            <OrderFilters
              busca={busca}
              onBuscaChange={handleBuscaChange}
              filtroData={filtroData}
              onFiltroDataChange={handleFiltroDataChange}
            />
          </div>

          <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />

          <OrderGrid
            pedidos={pedidosPaginados}
            onVisualizarPedido={handleVisualizarPedido}
            onAceitarPedido={handleAceitarPedido}
            onRecusarPedido={handleRecusarPedido}
            onConcluirPedido={handleConcluirPedido}
          />

          {pedidosFiltrados.length > itensPorPagina && (
            <PaginationControls
              currentPage={paginaAtual}
              totalPages={totalPaginas}
              onPageChange={setPaginaAtual}
            />
          )}
        </div>
      </div>

      <ModalComponent
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        title={`Detalhes do Pedido ${pedidoSelecionado?.id || ""}`}
        maxWidth="max-w-xl"
        footer={renderizarAcoesModal()}
      >
        <OrderDetailModalContent pedido={pedidoSelecionado} />
      </ModalComponent>
    </div>
  );
};

export default PedidosPage;
