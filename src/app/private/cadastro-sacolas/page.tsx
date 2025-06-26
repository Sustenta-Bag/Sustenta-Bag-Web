"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import Loading from "@/components/loading/Loading";
import {
  bagsService,
  Bag,
  CreateBagRequest,
  UpdateBagRequest,
  ALLOWED_TAGS,
  BagTag,
} from "@/services/bagsService";
import Swal from "sweetalert2";
import Image from "next/image";
import EditBagModal from "@/components/Modal/EditBagModal";

const CadastroSacolasPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: "Doce" as "Doce" | "Salgada" | "Mista",
    price: "",
    description: "",
    status: 1,
    tags: [] as BagTag[],
  });
  const [bags, setBags] = useState<Bag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBags, setIsLoadingBags] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filters, setFilters] = useState({
    status: "1" as "all" | "1" | "0",
    type: "all" as "all" | "Doce" | "Salgada" | "Mista",
  });
  const [sortBy, setSortBy] = useState<"price" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filteredAndSortedBags, setFilteredAndSortedBags] = useState<Bag[]>([]);

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
      if (!user?.idBusiness) return;

      setIsLoadingBags(true);
      try {
        const response = await bagsService.getBagsByBusiness(user.idBusiness);
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

    if (user?.idBusiness) {
      loadBagsData();
    }
  }, [user?.idBusiness]);

  useEffect(() => {
    let filtered = [...bags];

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (bag) => bag.status.toString() === filters.status
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((bag) => bag.type === filters.type);
    }

    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    setFilteredAndSortedBags(filtered);
  }, [bags, filters, sortBy, sortOrder]);
  const loadBags = async () => {
    if (!user?.idBusiness) return;

    setIsLoadingBags(true);
    try {
      const response = await bagsService.getBagsByBusiness(user.idBusiness);
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

  const handleTagChange = (tag: BagTag, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tags: checked ? [...prev.tags, tag] : prev.tags.filter((t) => t !== tag),
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.idBusiness) {
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
        idBusiness: user.idBusiness,
        status: formData.status,
        tags: formData.tags,
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
      tags: [],
    });
  };

  const openEditModal = (bag: Bag) => {
    setSelectedBag(bag);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBag(null);
  };

  const handleUpdateBag = async (id: number, bagData: UpdateBagRequest) => {
    setIsUpdating(true);
    try {
      const response = await bagsService.updateBag(id, bagData);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Sacola atualizada com sucesso!",
        });
        closeEditModal();
        loadBags();
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: response.message || "Erro ao atualizar sacola",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro de conexão",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBag = async (bag: Bag) => {
    const result = await Swal.fire({
      title: "Confirmar exclusão",
      text: `Tem certeza que deseja excluir a sacola "${bag.type}"? Esta ação não pode ser desfeita.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await bagsService.deleteBag(bag.id);

        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: "Sacola excluída com sucesso!",
          });
          loadBags();
        } else {
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: response.message || "Erro ao excluir sacola",
          });
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro de conexão",
        });
      }
    }
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

  const formatTagName = (tag: BagTag) => {
    return tag
      .replace(/PODE_CONTER_/g, "")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-green-700">
            Gerenciamento de Sacolas Sustentáveis
          </h1>
          <p className="text-gray-600">
            Cadastre e gerencie suas sacolas sustentáveis disponíveis para
            venda.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              Cadastrar Nova Sacola
            </h2>
            <p className="text-gray-600 mb-4">
              Cadastre novos tipos de sacolas sustentáveis para seu catálogo.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                </div>
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
                </div>
                {/* <div>
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
                </div> */}
              </div>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags de Alergias (Selecione as que se aplicam)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {ALLOWED_TAGS.map((tag) => (
                    <div key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        id={tag}
                        checked={formData.tags.includes(tag)}
                        onChange={(e) => handleTagChange(tag, e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={tag}
                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                      >
                        {formatTagName(tag)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
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
        </div>
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

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Filtros e Ordenação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value as "all" | "1" | "0",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos</option>
                  <option value="1">Ativa</option>
                  <option value="0">Inativa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value as
                        | "all"
                        | "Doce"
                        | "Salgada"
                        | "Mista",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos</option>
                  <option value="Doce">Doce</option>
                  <option value="Salgada">Salgada</option>
                  <option value="Mista">Mista</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "price" | "createdAt")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="createdAt">Data de Criação</option>
                  <option value="price">Preço</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredAndSortedBags.length} de {bags.length}
              sacola(s)
            </div>
          </div>

          {isLoadingBags ? (
            <div className="text-center py-10">
              <Loading size="large" text="Carregando sacolas..." />
            </div>
          ) : filteredAndSortedBags.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                {bags.length === 0
                  ? "Nenhuma sacola encontrada. Cadastre uma nova sacola!"
                  : "Nenhuma sacola corresponde aos filtros selecionados."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBags.map((bag) => (
                <div
                  key={bag.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/bag.png"
                      alt="Sacola"
                      width={200}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 relative">
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
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {bag.description}
                    </p>
                    {bag.tags && bag.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {bag.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                            >
                              {formatTagName(tag)}
                            </span>
                          ))}
                          {bag.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{bag.tags.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-gray-400">
                        Cadastrada em: {formatDate(bag.createdAt)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(bag)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center gap-1"
                          title="Editar sacola"
                        >
                          <i className="bx bx-edit text-lg"></i>
                          <span className="text-xs font-medium">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBag(bag)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1"
                          title="Excluir sacola"
                        >
                          <i className="bx bx-trash text-lg"></i>
                          <span className="text-xs font-medium">Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditBagModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        bag={selectedBag}
        onSave={handleUpdateBag}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default CadastroSacolasPage;
