"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import AlertComponent from "@/components/alertComponent/Alert";

// Definindo os tipos de links da navbar de acordo com o componente
interface NavLink {
  text: string;
  href: string;
  icon?: string;
  iconComponent?: React.ReactNode;
  position?: "left" | "right";
}

const ConfiguracaoPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
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
  // Perfil inicial com dados do usuário
  const [perfilForm, setPerfilForm] = useState({
    nomeFantasia: user?.legalName || "",
    email: user?.email || "",
    cnpj: user?.cnpj || "",
    cidade: user?.address?.city || "",
    bairro: user?.address?.complement || "",
    rua: user?.address?.street || "",
    numero: user?.address?.number || "",
    cep: user?.address?.zipCode || "",
  });

  // Formulário de segurança/senha
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  // Preferências de notificação
  const [notificacoes, setNotificacoes] = useState({
    novoPedido: true,
    statusPedido: true,
    promocoes: false,
    email: true,
    sistema: true,
  });

  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfilForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSenhaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificacoes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmitPerfil = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulação de atualização do perfil
    setAlert({
      visible: true,
      texto: "Perfil atualizado com sucesso!",
      tipo: "success",
    });
  };

  const handleSubmitSenha = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação de senha
    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      setAlert({
        visible: true,
        texto: "As senhas não conferem!",
        tipo: "error",
      });
      return;
    }

    // Simulação de alteração de senha bem-sucedida
    setAlert({
      visible: true,
      texto: "Senha alterada com sucesso!",
      tipo: "success",
    });

    // Limpar formulário
    setSenhaForm({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });
  };

  const handleSubmitNotificacoes = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulação de atualização de preferências
    setAlert({
      visible: true,
      texto: "Preferências de notificação salvas!",
      tipo: "success",
    });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6">Configurações</h1>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Menu lateral */}
              <div className="w-full md:w-64 shrink-0">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="font-medium text-gray-800 mb-4">Menu</h2>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setActiveTab("perfil")}
                        className={`flex items-center w-full p-2 rounded-md ${
                          activeTab === "perfil"
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <i className="bx bx-user mr-3"></i> Perfil
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab("seguranca")}
                        className={`flex items-center w-full p-2 rounded-md ${
                          activeTab === "seguranca"
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <i className="bx bx-lock mr-3"></i> Segurança
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab("notificacoes")}
                        className={`flex items-center w-full p-2 rounded-md ${
                          activeTab === "notificacoes"
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <i className="bx bx-bell mr-3"></i> Notificações
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab("integracao")}
                        className={`flex items-center w-full p-2 rounded-md ${
                          activeTab === "integracao"
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <i className="bx bx-link mr-3"></i> Integrações
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className="flex-grow">
                {/* Configurações de perfil */}
                {activeTab === "perfil" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Informações do Perfil
                    </h2>
                    <form onSubmit={handleSubmitPerfil} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="nomeFantasia"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nome Fantasia
                          </label>
                          <input
                            type="text"
                            id="nomeFantasia"
                            name="nomeFantasia"
                            value={perfilForm.nomeFantasia}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={perfilForm.email}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="cnpj"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            CNPJ
                          </label>
                          <input
                            type="text"
                            id="cnpj"
                            name="cnpj"
                            value={perfilForm.cnpj}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            O CNPJ não pode ser alterado
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="cep"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            CEP
                          </label>
                          <input
                            type="text"
                            id="cep"
                            name="cep"
                            value={perfilForm.cep}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="cidade"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Cidade
                          </label>
                          <input
                            type="text"
                            id="cidade"
                            name="cidade"
                            value={perfilForm.cidade}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="bairro"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Bairro
                          </label>
                          <input
                            type="text"
                            id="bairro"
                            name="bairro"
                            value={perfilForm.bairro}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="rua"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Rua
                          </label>
                          <input
                            type="text"
                            id="rua"
                            name="rua"
                            value={perfilForm.rua}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="numero"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Número
                          </label>
                          <input
                            type="text"
                            id="numero"
                            name="numero"
                            value={perfilForm.numero}
                            onChange={handlePerfilChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Configurações de segurança */}
                {activeTab === "seguranca" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Alterar Senha
                    </h2>
                    <form
                      onSubmit={handleSubmitSenha}
                      className="space-y-4 max-w-md"
                    >
                      <div>
                        <label
                          htmlFor="senhaAtual"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Senha Atual
                        </label>
                        <input
                          type="password"
                          id="senhaAtual"
                          name="senhaAtual"
                          value={senhaForm.senhaAtual}
                          onChange={handleSenhaChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="novaSenha"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          id="novaSenha"
                          name="novaSenha"
                          value={senhaForm.novaSenha}
                          onChange={handleSenhaChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmarSenha"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          id="confirmarSenha"
                          name="confirmarSenha"
                          value={senhaForm.confirmarSenha}
                          onChange={handleSenhaChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Alterar Senha
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Configurações de notificações */}
                {activeTab === "notificacoes" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Preferências de Notificação
                    </h2>
                    <form
                      onSubmit={handleSubmitNotificacoes}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <h3 className="text-md font-medium text-gray-700">
                          Eventos
                        </h3>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="novoPedido"
                            name="novoPedido"
                            checked={notificacoes.novoPedido}
                            onChange={handleNotificacaoChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="novoPedido"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Novos pedidos
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="statusPedido"
                            name="statusPedido"
                            checked={notificacoes.statusPedido}
                            onChange={handleNotificacaoChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="statusPedido"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Atualizações de status de pedidos
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="promocoes"
                            name="promocoes"
                            checked={notificacoes.promocoes}
                            onChange={handleNotificacaoChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="promocoes"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Promoções e novidades
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-md font-medium text-gray-700">
                          Canais
                        </h3>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="email"
                            name="email"
                            checked={notificacoes.email}
                            onChange={handleNotificacaoChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="email"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Email
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="sistema"
                            name="sistema"
                            checked={notificacoes.sistema}
                            onChange={handleNotificacaoChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="sistema"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Notificações no sistema
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Salvar Preferências
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Configurações de integração */}
                {activeTab === "integracao" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Integrações</h2>
                    <p className="text-gray-600 mb-4">
                      Conecte sua conta Sustenta Bag com outras plataformas e
                      serviços.
                    </p>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="bx bxl-shopify text-3xl text-[#96bf47] mr-3"></i>
                          <div>
                            <h3 className="font-medium">Shopify</h3>
                            <p className="text-sm text-gray-500">
                              Sincronize pedidos com sua loja Shopify
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                          Conectar
                        </button>
                      </div>

                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="bx bxl-whatsapp text-3xl text-[#25D366] mr-3"></i>
                          <div>
                            <h3 className="font-medium">WhatsApp Business</h3>
                            <p className="text-sm text-gray-500">
                              Receba atualizações via WhatsApp
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                          Conectar
                        </button>
                      </div>

                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <i className="bx bxs-truck text-3xl text-blue-600 mr-3"></i>
                          <div>
                            <h3 className="font-medium">Serviços de Entrega</h3>
                            <p className="text-sm text-gray-500">
                              Integre com transportadoras
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                          Configurar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de confirmação */}
      {alert.visible && (
        <AlertComponent
          tipo={alert.tipo}
          texto={alert.texto}
          visible={alert.visible}
          timeout={3000}
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

export default ConfiguracaoPage;
