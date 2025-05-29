"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import Loading from "@/components/loading/Loading";
import { bagsService, Bag, CreateBagRequest } from "@/services/bagsService";
import Swal from "sweetalert2";
import Image from "next/image";

const CadastroSacolasPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "Doce" as "Doce" | "Salgada" | "Mista",
    price: "",
    description: "",
    status: 1,
  });
  const [bags, setBags] = useState<Bag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBags, setIsLoadingBags] = useState(true);

  const navLinks = [
    { text: "Página Inicial", href: "/private/homePage", icon: "bx-home" },
    { text: "Pedidos", href: "/private/pedidos", icon: "bx-package" },
    {
      text: "Cadastro de Sacolas",
      href: "/private/cadastro-sacolas",
      icon: "bx-shopping-bag",
    },
    { text: "Configurações", href: "/private/configuracao", icon: "bx-cog" },
  ];
  useEffect(() => {
    const loadBagsData = async () => {
      if (!user?.id) return;

      setIsLoadingBags(true);
      try {
        const response = await bagsService.getBagsByBusiness(user.id);
        if (response.success && response.data) {
          setBags(response.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: response.message || "Erro ao carregar sacolas",
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro de conexão",
        });
      } finally {
        setIsLoadingBags(false);
      }
    };

    if (user?.id) {
      loadBagsData();
    }
  }, [user?.id]);
  const loadBags = async () => {
    if (!user?.id) return;

    setIsLoadingBags(true);
    try {
      const response = await bagsService.getBagsByBusiness(user.id);
      if (response.success && response.data) {
        setBags(response.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: response.message || "Erro ao carregar sacolas",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro de conexão",
      });
    } finally {
      setIsLoadingBags(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? value : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Usuário não identificado",
      });
      return;
    }

    if (!formData.type || !formData.price || !formData.description) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Por favor, preencha todos os campos obrigatórios",
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Por favor, insira um preço válido",
      });
      return;
    }

    setIsLoading(true);
    try {
      const bagData: CreateBagRequest = {
        type: formData.type,
        price: price,
        description: formData.description,
        idBusiness: user.id,
        status: formData.status,
      };

      const response = await bagsService.createBag(bagData);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Sacola cadastrada com sucesso!",
        });
        resetForm();
        loadBags();
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: response.message || "Erro ao cadastrar sacola",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro de conexão",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      type: "Doce",
      price: "",
      description: "",
      status: 1,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusText = (status: number) => {
    return status === 1 ? "Ativa" : "Inativa";
  };

  const getStatusColor = (status: number) => {
    return status === 1
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="container mx-auto px-4 py-8">
        {" "}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-green-700">
            Gerenciamento de Sacolas Sustentáveis
          </h1>
          <p className="text-gray-600">
            Cadastre e gerencie suas sacolas sustentáveis disponíveis para
            venda.
          </p>
        </div>{" "}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              Cadastrar Nova Sacola
            </h2>
            <p className="text-gray-600 mb-4">
              Cadastre novos tipos de sacolas sustentáveis para seu catálogo.
            </p>{" "}
            <form onSubmit={handleSubmit} className="space-y-4">
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo da Sacola <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Doce">Doce</option>
                    <option value="Salgada">Salgada</option>
                    <option value="Mista">Mista</option>
                  </select>
                </div>{" "}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Preço (R$) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: 25.90"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>{" "}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={1}>Ativa</option>
                    <option value={0}>Inativa</option>
                  </select>
                </div>
              </div>{" "}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Descreva a sacola, seus ingredientes e características..."
                  required
                />
              </div>{" "}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loading size="small" text="" />
                      <span>Cadastrando...</span>
                    </div>
                  ) : (
                    "Cadastrar Sacola"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>{" "}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-700">
              Sacolas Cadastradas
            </h2>
            <button
              onClick={loadBags}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <i className="bx bx-refresh mr-2"></i>
              Atualizar
            </button>
          </div>

          {isLoadingBags ? (
            <div className="text-center py-10">
              <Loading size="large" text="Carregando sacolas..." />
            </div>
          ) : bags.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                Nenhuma sacola encontrada. Cadastre uma nova sacola!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bags.map((bag) => (
                <div
                  key={bag.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {" "}
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/bag.png"
                      alt="Sacola"
                      width={200}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                  </div>{" "}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Sacola {bag.type}
                        </h3>
                        <p className="text-lg font-bold text-green-600">
                          {formatPrice(bag.price)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                          bag.status
                        )}`}
                      >
                        {getStatusText(bag.status)}
                      </span>
                    </div>{" "}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {bag.description}
                    </p>{" "}
                    <div className="text-xs text-gray-400">
                      Cadastrada em: {formatDate(bag.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastroSacolasPage;
