"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import SecondaryButton from "@/components/button/SecondaryButton";
import PrimaryButton from "@/components/button/PrimaryButton";
import ModalComponent from "@/components/Modal/ModalComponent";
import AlertComponent from "@/components/alertComponent/Alert";
import { Pedido, pedidosService } from "@/services/pedidosService";
import dynamic from "next/dynamic";
import {
  FaBox,
  FaShoppingBag,
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaClock,
  FaBell,
  FaUser,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaPlus,
  FaArrowRight,
  FaCheckCircle,
  FaDollarSign,
  FaWater,
  FaRecycle,
  FaSun,
  FaLightbulb,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { formatarMoeda } from "@/utils/formatters";

// Importando apenas os ícones que estamos usando
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Definição de tipos para o ApexCharts
import { ApexOptions } from "apexcharts";

interface ApexChartSeries {
  name?: string;
  data: number[];
}

interface ChartDataType {
  options: ApexOptions;
  series: ApexChartSeries[] | number[];
}

interface NavLink {
  text: string;
  href: string;
  icon?: string;
  position?: "left" | "right";
}

interface SacolaVendida {
  nome: string;
  quantidade: number;
}

interface Estatisticas {
  total: number;
  totalValor: number;
  sacolas: number;
}

interface AlertState {
  visible: boolean;
  texto: string;
  tipo: "success" | "info" | "warning" | "error";
}

const HomePage = () => {
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([]);
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    texto: "",
    tipo: "success",
  });
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    total: 0,
    totalValor: 0,
    sacolas: 0,
  });

  // Gráficos (mantém igual)
  const [vendasPorDia, setVendasPorDia] = useState<ChartDataType>({
    options: {
      chart: {
        id: "vendas-diarias",
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      colors: ["#037335"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Inter', sans-serif",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Inter', sans-serif",
          },
          formatter: (value: number) => `R$ ${value.toFixed(0)}`,
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value: number) => `R$ ${value.toFixed(2)}`,
        },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
      },
      noData: {
        text: "Carregando dados...",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#64748b",
          fontSize: "16px",
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
    series: [
      {
        name: "Vendas",
        data: [],
      },
    ],
  });

  // Configuração inicial do gráfico de sacolas com valores padrão
  // para evitar problemas com a renderização
  const [sacolasVendidas, setSacolasVendidas] = useState<ChartDataType>({
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Carregando..."],
      colors: ["#037335", "#129B53", "#30B171", "#7BD9A1", "#AFF3C2"],
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: "bottom",
        fontFamily: "'Inter', sans-serif",
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value} unidades`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              },
              value: {
                show: true,
                fontSize: "18px",
                fontFamily: "'Inter', sans-serif",
                formatter: (val: string) => `${val} un`,
              },
              total: {
                show: true,
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                label: "Total",
                formatter: function (w: any) {
                  // w.globals.seriesTotals is an array of numbers
                  const total = w.globals.seriesTotals
                    ? w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                    : 0;
                  return `${total} un`;
                },
              },
            },
          },
        },
      },
      xaxis: {
        categories: ["Carregando..."],
      },
      noData: {
        text: "Carregando dados de sacolas...",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#64748b",
          fontSize: "16px",
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
    series: [0], // Valor inicial para evitar erro de renderização
  });

  const [statusPedidos, setStatusPedidos] = useState<ChartDataType>({
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: ["#FBBF24", "#10B981", "#3B82F6", "#EF4444"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: ["Pendentes", "Confirmados", "Concluídos", "Recusados"],
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Inter', sans-serif",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "'Inter', sans-serif",
          },
        },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value: number) => `${value} pedidos`,
        },
      },
      noData: {
        text: "Carregando dados...",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#64748b",
          fontSize: "16px",
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
    series: [
      {
        name: "Pedidos",
        data: [0, 0, 0, 0], // Valores iniciais
      },
    ],
  });

  // Links da Navbar com ícones
  const navLinks: NavLink[] = [
    { text: "Página Inicial", href: "/private/homePage", icon: "home" },
    { text: "Pedidos", href: "/private/pedidos", icon: "box" },
    {
      text: "Cadastro de Sacolas",
      href: "/private/cadastro-sacolas",
      icon: "shopping-bag",
    },
    {
      text: "Configuração",
      href: "/private/configuracao",
      icon: "cog",
      position: "right",
    },
  ];

  // Carregar pedidos da API e atualizar dashboard
  const carregarPedidos = async () => {
    const resultado = await pedidosService.getOrdersByBusiness();
    if (resultado.success && resultado.data) {
      setPedidosPendentes(
        resultado.data.filter(
          (p) =>
            p.status === "pendente" ||
            p.status === "confirmado" ||
            p.status === "pago" ||
            p.status === "preparando"
        )
      );
    } else {
      setPedidosPendentes([]);
    }
    atualizarDashboard();
  };

  // Carregar dados iniciais
  useEffect(() => {
    carregarPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para atualizar todos os gráficos e estatísticas
  const atualizarDashboard = () => {
    try {
      // Carregar estatísticas
      const stats = pedidosService.obterEstatisticas();
      setEstatisticas({
        total: stats.total,
        totalValor: stats.valorTotal,
        sacolas: pedidosService.obterTodos().reduce(
          (acc, pedido) => acc + (pedido.quantidadeSacolas || 0),
          0
        ),
      });

      // Gráfico de status dos pedidos
      setStatusPedidos((prev) => ({
        ...prev,
        series: [
          {
            name: "Pedidos",
            data: [
              stats.pendentes,
              stats.confirmados,
              stats.concluidos,
              stats.recusados,
            ],
          },
        ],
      }));
    } catch (error) {
      console.error("Erro ao carregar dados dos gráficos:", error);
    }
  };

  // Função para aceitar um pedido
  const handleAceitarPedido = async (id: string): Promise<void> => {
    try {
      const pedidoAtualizado = await pedidosService.atualizarStatus(id, "confirmado");
      if (pedidoAtualizado) {
        carregarPedidos();
        setAlert({
          visible: true,
          texto: `Pedido ${id} aceito com sucesso!`,
          tipo: "success",
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        texto: `Erro ao aceitar o pedido. Tente novamente.`,
        tipo: "error",
      });
    }
  };

  // Função para recusar um pedido
  const handleRecusarPedido = async (id: string): Promise<void> => {
    try {
      const pedidoAtualizado = await pedidosService.atualizarStatus(id, "cancelado");
      if (pedidoAtualizado) {
        carregarPedidos();
        setAlert({
          visible: true,
          texto: `Pedido ${id} recusado.`,
          tipo: "info",
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        texto: `Erro ao recusar o pedido. Tente novamente.`,
        tipo: "error",
      });
    }
  };

  // Função para marcar um pedido como em preparo
  const handlePrepararPedido = async (id: string): Promise<void> => {
    try {
      const pedidoAtualizado = await pedidosService.atualizarStatus(id, "preparando");
      if (pedidoAtualizado) {
        carregarPedidos();
        setAlert({
          visible: true,
          texto: `Pedido ${id} está sendo preparado.`,
          tipo: "info",
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        texto: `Erro ao preparar o pedido. Tente novamente.`,
        tipo: "error",
      });
    }
  };

  // Função para marcar um pedido como pronto
  const handleProntoPedido = async (id: string): Promise<void> => {
    try {
      const pedidoAtualizado = await pedidosService.atualizarStatus(id, "pronto");
      if (pedidoAtualizado) {
        carregarPedidos();
        setAlert({
          visible: true,
          texto: `Pedido ${id} está pronto para entrega.`,
          tipo: "info",
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        texto: `Erro ao atualizar o status do pedido. Tente novamente.`,
        tipo: "error",
      });
    }
  };

  // Fechar alerta
  const handleCloseAlert = (): void => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  // Função para renderizar botões de ação conforme status
  const renderizarAcoesPedido = (pedido: Pedido) => {
    switch (pedido.status) {
      case "pendente":
        return (
          <>
            <button
              onClick={() => handleAceitarPedido(pedido.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
            >
              <FaCheck className="mr-1" /> Aceitar
            </button>
            <button
              onClick={() => handleRecusarPedido(pedido.id)}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
            >
              <FaTimes className="mr-1" /> Recusar
            </button>
          </>
        );
      case "confirmado":
      case "pago":
        return (
          <button
            onClick={() => handlePrepararPedido(pedido.id)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
          >
            <FaCheck className="mr-1" /> Iniciar Preparo
          </button>
        );
      case "preparando":
        return (
          <button
            onClick={() => handleProntoPedido(pedido.id)}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
          >
            <FaCheck className="mr-1" /> Marcar como Pronto
          </button>
        );
      default:
        return null;
    }
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

          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] flex items-center">
              <MdDashboard className="text-[#037335] text-3xl mr-2" />
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Visão geral do desempenho da sua empresa
            </p>
          </div>

          {/* Cartões de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#037335] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total de Pedidos</p>
                  <p className="text-3xl font-bold mt-2">
                    {estatisticas.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaBox className="text-[#037335] text-2xl" />
                </div>
              </div>
              <div className="w-full mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="bg-[#037335] h-2 rounded-full"
                  style={{
                    width: `${Math.min((estatisticas.total / 10) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Receita Total</p>
                  <p className="text-3xl font-bold mt-2">
                    {formatarMoeda(estatisticas.totalValor)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaDollarSign className="text-blue-600 text-2xl" />
                </div>
              </div>
              <div className="w-full mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (estatisticas.totalValor / 1500) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Sacolas Vendidas</p>
                  <p className="text-3xl font-bold mt-2">
                    {estatisticas.sacolas}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaShoppingBag className="text-purple-600 text-2xl" />
                </div>
              </div>
              <div className="w-full mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (estatisticas.sacolas / 50) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FaChartLine className="text-[#037335] mr-2" />
                Vendas dos Últimos 7 Dias
              </h2>
              <div className="h-80">
                {typeof window !== "undefined" && (
                  <Chart
                    options={vendasPorDia.options}
                    series={vendasPorDia.series}
                    type="area"
                    height="100%"
                    key="vendas-chart"
                  />
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FaChartPie className="text-[#037335] mr-2" />
                Distribuição de Sacolas Vendidas
              </h2>
              <div className="h-80">
                {typeof window !== "undefined" && (
                  <Chart
                    options={sacolasVendidas.options}
                    series={sacolasVendidas.series}
                    type="donut"
                    height="100%"
                    key="sacolas-chart"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FaChartBar className="text-[#037335] mr-2" />
                Status dos Pedidos
              </h2>
              <div className="h-64">
                {typeof window !== "undefined" && (
                  <Chart
                    options={statusPedidos.options}
                    series={statusPedidos.series}
                    type="bar"
                    height="100%"
                    key="status-chart"
                  />
                )}
              </div>
            </div>

            {/* Dashboard de pedidos pendentes */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaClock className="text-amber-500 mr-2" />
                  Pedidos Pendentes
                </h2>
                <ModalComponent
                  textButton={
                    <div className="bg-[#037335] text-white py-2 px-4 rounded-lg hover:bg-[#025a29] transition-colors flex items-center">
                      <FaPlus className="mr-1.5" />
                      Nova Sacola
                    </div>
                  }
                  title="Sugerir Nova Sacola"
                  footer={
                    <div className="flex justify-end space-x-2">
                      <SecondaryButton>Cancelar</SecondaryButton>
                      <PrimaryButton>Enviar Sugestão</PrimaryButton>
                    </div>
                  }
                >
                  Preencha o formulário abaixo para sugerir um novo modelo de sacola sustentável. Nossa equipe analisará sua sugestão e entrará em contato em breve.
                </ModalComponent>
              </div>

              {pedidosPendentes.length > 0 ? (
                <div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaBell className="text-amber-500 text-xl mr-2" />
                        <span className="font-medium text-amber-800">
                          Você tem pedidos aguardando ação
                        </span>
                      </div>
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {pedidosPendentes.length}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="grid gap-4">
                      {pedidosPendentes.slice(0, 3).map((pedido) => (
                        <div
                          key={pedido.id}
                          className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="font-semibold text-gray-800">
                                  {pedido.id}
                                </span>
                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium ml-2 inline-flex items-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
                                  {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>
                                  <FaUser className="text-gray-400 mr-1.5 inline-block" />{" "}
                                  {pedido.cliente}
                                </p>
                                <p>
                                  <FaBox className="text-gray-400 mr-1.5 inline-block" />{" "}
                                  {pedido.produto}
                                </p>
                                <p className="flex items-center justify-between">
                                  <span>
                                    <FaCalendarAlt className="text-gray-400 mr-1.5 inline-block" />{" "}
                                    {pedido.data}
                                  </span>
                                  <span className="font-medium text-[#037335]">
                                    {formatarMoeda(pedido.valor)}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:self-center">
                              {renderizarAcoesPedido(pedido)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {pedidosPendentes.length > 3 && (
                      <div className="mt-4 text-center">
                        <a
                          href="/private/pedidos?tab=pendentes"
                          className="text-[#037335] hover:underline inline-flex items-center text-sm font-medium"
                        >
                          Ver todos os {pedidosPendentes.length} pedidos pendentes
                          <FaArrowRight className="ml-1 text-lg" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <FaCheckCircle className="text-green-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-green-800 mb-1">
                    Nenhum pedido pendente
                  </h3>
                  <p className="text-green-600">
                    Você está em dia! Não há pedidos aguardando ação.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dicas e recursos úteis */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaLightbulb className="text-amber-500 mr-2" />
              Dicas Sustentáveis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-200 p-3 rounded-full mr-3">
                    <FaWater className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="font-medium text-blue-800">Economize Água</h3>
                </div>
                <p className="text-sm text-blue-600">
                  Economize água na produção de sacolas utilizando sistemas de
                  reaproveitamento.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center mb-3">
                  <div className="bg-green-200 p-3 rounded-full mr-3">
                    <FaRecycle className="text-green-600 text-xl" />
                  </div>
                  <h3 className="font-medium text-green-800">
                    Materiais Recicláveis
                  </h3>
                </div>
                <p className="text-sm text-green-600">
                  Utilize materiais 100% recicláveis e de fontes sustentáveis em
                  suas sacolas.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-200 p-3 rounded-full mr-3">
                    <FaSun className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="font-medium text-purple-800">
                    Energia Sustentável
                  </h3>
                </div>
                <p className="text-sm text-purple-600">
                  Invista em energia solar para tornar sua produção mais
                  sustentável e econômica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
