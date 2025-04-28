"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import SecondaryButton from "@/components/button/SecondaryButton";
import ModalComponent from "@/components/Modal/ModalComponent";
import AlertComponent from "@/components/alertComponent/Alert";
import { Pedido, pedidosService } from "@/services/pedidosService";

const HomePage = () => {
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([]);
  const [alert, setAlert] = useState({
    visible: false,
    texto: "",
    tipo: "success" as "success" | "info" | "warning" | "error",
  });

  // Links da Navbar com ícones
  const navLinks = [
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

  // Carregar pedidos pendentes no carregamento da página
  useEffect(() => {
    const pedidos = pedidosService.obterPorStatus("pendente");
    setPedidosPendentes(pedidos);
  }, []);

  // Função para aceitar um pedido
  const handleAceitarPedido = (id: string) => {
    const pedidoAtualizado = pedidosService.atualizarStatus(id, "aceito");
    if (pedidoAtualizado) {
      setPedidosPendentes((prev) => prev.filter((p) => p.id !== id));
      setAlert({
        visible: true,
        texto: `Pedido ${id} aceito com sucesso!`,
        tipo: "success",
      });
    }
  };

  // Função para recusar um pedido
  const handleRecusarPedido = (id: string) => {
    const pedidoAtualizado = pedidosService.atualizarStatus(id, "recusado");
    if (pedidoAtualizado) {
      setPedidosPendentes((prev) => prev.filter((p) => p.id !== id));
      setAlert({
        visible: true,
        texto: `Pedido ${id} recusado.`,
        tipo: "info",
      });
    }
  };

  // Fechar alerta
  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            {/* Dashboard de pedidos não aceitos */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pedidos Pendentes</h2>
                <ModalComponent
                  textButton="Sugerir Nova Sacola"
                  titleModal="Sugerir Nova Sacola"
                  textModal="Preencha o formulário abaixo para sugerir um novo modelo de sacola sustentável. Nossa equipe analisará sua sugestão e entrará em contato em breve."
                />
              </div>

              {pedidosPendentes.length > 0 ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="bx bx-time text-yellow-500 text-2xl mr-3"></i>
                        <span className="font-medium">
                          Você tem pedidos aguardando aceitação
                        </span>
                      </div>
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full font-medium">
                        {pedidosPendentes.length}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">
                            Pedido
                          </th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">
                            Cliente
                          </th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">
                            Produto
                          </th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">
                            Data
                          </th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">
                            Valor
                          </th>
                          <th className="py-3 px-4 text-center font-medium text-gray-600">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pedidosPendentes.map((pedido) => (
                          <tr key={pedido.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">{pedido.id}</td>
                            <td className="py-3 px-4">{pedido.cliente}</td>
                            <td className="py-3 px-4">{pedido.produto}</td>
                            <td className="py-3 px-4">{pedido.data}</td>
                            <td className="py-3 px-4">
                              R$ {pedido.valor.toFixed(2).replace(".", ",")}
                            </td>
                            <td className="py-3 px-4 flex justify-center space-x-2">
                              <SecondaryButton
                                onClick={() => handleAceitarPedido(pedido.id)}
                              >
                                <i className="bx bx-check mr-1"></i> Aceitar
                              </SecondaryButton>
                              <SecondaryButton
                                onClick={() => handleRecusarPedido(pedido.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <i className="bx bx-x mr-1"></i> Recusar
                              </SecondaryButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <i className="bx bx-check-circle text-green-500 text-4xl mb-2"></i>
                  <h3 className="text-lg font-medium text-green-800 mb-1">
                    Nenhum pedido pendente
                  </h3>
                  <p className="text-green-600">
                    Você não tem pedidos aguardando aceitação no momento.
                  </p>
                </div>
              )}
            </div>

            {/* Estatísticas e resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <i className="bx bx-package text-blue-500 text-2xl mr-2"></i>
                  <h3 className="font-semibold text-blue-800">
                    Total de Pedidos
                  </h3>
                </div>
                <p className="text-3xl font-bold text-blue-700">5</p>
                <p className="text-sm text-blue-600 mt-1">Últimos 30 dias</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <i className="bx bx-dollar-circle text-green-500 text-2xl mr-2"></i>
                  <h3 className="font-semibold text-green-800">
                    Receita Total
                  </h3>
                </div>
                <p className="text-3xl font-bold text-green-700">R$ 1.280,00</p>
                <p className="text-sm text-green-600 mt-1">Últimos 30 dias</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <i className="bx bx-shopping-bag text-purple-500 text-2xl mr-2"></i>
                  <h3 className="font-semibold text-purple-800">
                    Sacolas Vendidas
                  </h3>
                </div>
                <p className="text-3xl font-bold text-purple-700">42</p>
                <p className="text-sm text-purple-600 mt-1">Últimos 30 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta */}
      {alert.visible && (
        <AlertComponent
          tipo={alert.tipo}
          texto={alert.texto}
          visible={alert.visible}
          timeout={3000}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default HomePage;
