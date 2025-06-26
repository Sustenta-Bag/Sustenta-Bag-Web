"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import AlertComponent from "@/components/alertComponent/Alert";
import { businessService, BusinessUpdateData } from "@/services/businessService";

// Definindo os tipos de links da navbar de acordo com o componente
interface NavLink {
  text: string;
  href: string;
  icon?: string;
  iconComponent?: React.ReactNode;
  position?: "left" | "right";
}

const ConfiguracaoPage = () => {
  const { user, idBusiness } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Formulário de empresa com todos os campos necessários
  const [empresaForm, setEmpresaForm] = useState({
    legalName: user?.legalName || "",
    cnpj: user?.cnpj || "",
    appName: user?.appName || "",
    cellphone: user?.cellphone || "",
    description: user?.description || "",
    delivery: user?.delivery || false,
    deliveryTax: user?.deliveryTax || 0,
    develiveryTime: 30, // Valor padrão
    openingHours: "08:00-18:00", // Valor padrão
  });


  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEmpresaForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEmpresa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!idBusiness) {
      setAlert({
        visible: true,
        texto: "ID da empresa não encontrado. Faça login novamente.",
        tipo: "error",
      });
      return;
    }

    try {
      const updateData: BusinessUpdateData = {
        legalName: empresaForm.legalName,
        cnpj: empresaForm.cnpj,
        appName: empresaForm.appName,
        cellphone: empresaForm.cellphone,
        description: empresaForm.description,
        delivery: empresaForm.delivery,
        deliveryTax: empresaForm.deliveryTax,
        develiveryTime: empresaForm.develiveryTime,
        openingHours: empresaForm.openingHours,
        idAddress: 1, // Valor fixo conforme especificado
        logo: logoFile || undefined,
      };

      await businessService.updateBusiness(idBusiness?.toString() || "1", updateData);
      
      setAlert({
        visible: true,
        texto: "Dados da empresa atualizados com sucesso!",
        tipo: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      setAlert({
        visible: true,
        texto: "Erro ao atualizar dados da empresa. Tente novamente.",
        tipo: "error",
      });
    }
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
                  </ul>
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className="flex-grow">
                {/* Configurações de perfil */}
                {activeTab === "perfil" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Dados da Empresa
                    </h2>
                    <form onSubmit={handleSubmitEmpresa} className="space-y-6">
                      {/* Upload de Logo */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo da Empresa
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            {logoPreview ? (
                              <Image
                                src={logoPreview}
                                alt="Preview do logo"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <i className="bx bx-image text-gray-400 text-2xl"></i>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleLogoChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                              Escolher Logo
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG até 2MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="legalName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Razão Social
                          </label>
                          <input
                            type="text"
                            id="legalName"
                            name="legalName"
                            value={empresaForm.legalName}
                            onChange={handleEmpresaChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="appName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nome do App/Loja
                          </label>
                          <input
                            type="text"
                            id="appName"
                            name="appName"
                            value={empresaForm.appName}
                            onChange={handleEmpresaChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
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
                            value={empresaForm.cnpj}
                            onChange={handleEmpresaChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            O CNPJ não pode ser alterado
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="cellphone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Telefone
                          </label>
                          <input
                            type="text"
                            id="cellphone"
                            name="cellphone"
                            value={empresaForm.cellphone}
                            onChange={handleEmpresaChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="openingHours"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Horário de Funcionamento
                          </label>
                          <input
                            type="text"
                            id="openingHours"
                            name="openingHours"
                            value={empresaForm.openingHours}
                            onChange={handleEmpresaChange}
                            placeholder="08:00-18:00"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="develiveryTime"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Tempo de Entrega (minutos)
                          </label>
                          <input
                            type="number"
                            id="develiveryTime"
                            name="develiveryTime"
                            value={empresaForm.develiveryTime}
                            onChange={handleEmpresaChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="deliveryTax"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Taxa de Entrega (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            id="deliveryTax"
                            name="deliveryTax"
                            value={empresaForm.deliveryTax}
                            onChange={handleEmpresaChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Descrição da Empresa
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={empresaForm.description}
                          onChange={handleEmpresaChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Descreva brevemente sua empresa..."
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="delivery"
                          name="delivery"
                          checked={empresaForm.delivery}
                          onChange={handleEmpresaChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="delivery"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Oferece serviço de entrega
                        </label>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </form>
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
