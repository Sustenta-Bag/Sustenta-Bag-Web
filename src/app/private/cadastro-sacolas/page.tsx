"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import AlertComponent from "@/components/alertComponent/Alert";
import {
  Sacola,
  sacolasService,
  FiltroSacolas,
} from "@/services/sacolasService";

const CadastroSacolasPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "pequena" as "pequena" | "media" | "grande" | "personalizada",
    material: "papel" as "papel" | "algodao" | "juta" | "bioplastico" | "outro",
    largura: "",
    altura: "",
    preco: "",
    estoque: "",
    descricao: "",
    imagemUrl: "",
    sustentabilidade: 3,
  });

  const [sacolas, setSacolas] = useState<Sacola[]>([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [sacolaEmEdicaoId, setSacolaEmEdicaoId] = useState<string | null>(null);
  const [buscaTermo, setBuscaTermo] = useState("");
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [filtros, setFiltros] = useState<FiltroSacolas>({
    ordenarPor: "nome",
    ordem: "asc",
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [view, setView] = useState<"cards" | "lista">("cards");

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

  // Carregar sacolas e estatísticas ao iniciar
  useEffect(() => {
    carregarSacolas();
    atualizarEstatisticas();
  }, []);

  const carregarSacolas = () => {
    if (filtros.ordenarPor) {
      const sacolasCarregadas = sacolasService.filtrarSacolas(filtros);
      setSacolas(sacolasCarregadas);
    } else if (buscaTermo) {
      const sacolasEncontradas = sacolasService.buscarSacolas(buscaTermo);
      setSacolas(sacolasEncontradas);
    } else {
      const sacolasCarregadas = sacolasService.obterTodas();
      setSacolas(sacolasCarregadas);
    }
  };

  const atualizarEstatisticas = () => {
    const stats = sacolasService.obterEstatisticas();
    setEstatisticas(stats);
  };

  const buscarSacolas = () => {
    const sacolasEncontradas = sacolasService.buscarSacolas(buscaTermo);
    setSacolas(sacolasEncontradas);
  };

  const aplicarFiltros = () => {
    carregarSacolas();
    setMostrarFiltros(false);
  };

  const resetarFiltros = () => {
    setFiltros({
      ordenarPor: "nome",
      ordem: "asc",
    });
    setBuscaTermo("");
    setMostrarFiltros(false);
    const sacolasCarregadas = sacolasService.obterTodas();
    setSacolas(sacolasCarregadas);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (modoEdicao && sacolaEmEdicaoId) {
        // Atualizar sacola existente
        const sacolaAtualizada = sacolasService.atualizarSacola(
          sacolaEmEdicaoId,
          {
            nome: formData.nome,
            tipo: formData.tipo,
            material: formData.material,
            largura: formData.largura
              ? parseFloat(formData.largura)
              : undefined,
            altura: formData.altura ? parseFloat(formData.altura) : undefined,
            preco: parseFloat(formData.preco),
            estoque: parseInt(formData.estoque),
            descricao: formData.descricao || undefined,
            imagemUrl: formData.imagemUrl || undefined,
            sustentabilidade: formData.sustentabilidade,
          }
        );

        if (sacolaAtualizada) {
          setAlert({
            visible: true,
            texto: "Sacola atualizada com sucesso!",
            tipo: "success",
          });
        } else {
          setAlert({
            visible: true,
            texto: "Erro ao atualizar sacola.",
            tipo: "error",
          });
        }
      } else {
        // Criar nova sacola
        const novaSacola = sacolasService.adicionarSacola({
          nome: formData.nome,
          tipo: formData.tipo,
          material: formData.material,
          largura: formData.largura ? parseFloat(formData.largura) : undefined,
          altura: formData.altura ? parseFloat(formData.altura) : undefined,
          preco: parseFloat(formData.preco),
          estoque: parseInt(formData.estoque),
          descricao: formData.descricao || undefined,
          imagemUrl: formData.imagemUrl || undefined,
          sustentabilidade: formData.sustentabilidade,
        });

        setAlert({
          visible: true,
          texto: "Sacola cadastrada com sucesso!",
          tipo: "success",
        });
      }

      // Recarregar a lista de sacolas e estatísticas
      carregarSacolas();
      atualizarEstatisticas();

      // Limpar formulário
      resetForm();
    } catch (erro) {
      console.error(erro);
      setAlert({
        visible: true,
        texto:
          "Erro ao processar sacola. Verifique os dados e tente novamente.",
        tipo: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      tipo: "pequena",
      material: "papel",
      largura: "",
      altura: "",
      preco: "",
      estoque: "",
      descricao: "",
      imagemUrl: "",
      sustentabilidade: 3,
    });
    setModoEdicao(false);
    setSacolaEmEdicaoId(null);
  };

  const handleEditarSacola = (sacola: Sacola) => {
    setFormData({
      nome: sacola.nome,
      tipo: sacola.tipo,
      material: sacola.material,
      largura: sacola.largura ? sacola.largura.toString() : "",
      altura: sacola.altura ? sacola.altura.toString() : "",
      preco: sacola.preco.toString(),
      estoque: sacola.estoque.toString(),
      descricao: sacola.descricao || "",
      imagemUrl: sacola.imagemUrl || "",
      sustentabilidade: sacola.sustentabilidade || 3,
    });
    setModoEdicao(true);
    setSacolaEmEdicaoId(sacola.id);

    // Scroll até o formulário
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExcluirSacola = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta sacola?")) {
      const removido = sacolasService.removerSacola(id);
      if (removido) {
        setAlert({
          visible: true,
          texto: "Sacola removida com sucesso!",
          tipo: "success",
        });
        carregarSacolas();
        atualizarEstatisticas();
      } else {
        setAlert({
          visible: true,
          texto: "Erro ao remover sacola.",
          tipo: "error",
        });
      }
    }
  };

  const togglePopular = (id: string) => {
    const resultado = sacolasService.togglePopular(id);
    if (resultado) {
      carregarSacolas();
      setAlert({
        visible: true,
        texto: "Status popular alterado com sucesso!",
        tipo: "success",
      });
    }
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  // Formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Renderizar estrelas de sustentabilidade
  const renderSustentabilidade = (nivel?: number) => {
    if (!nivel) return null;

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`text-lg ${
              n <= nivel ? "text-green-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho e Dashboard */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-green-700">
            Gerenciamento de Sacolas Sustentáveis
          </h1>

          {estatisticas && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total de Modelos</p>
                <p className="text-2xl font-bold">{estatisticas.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Estoque Total</p>
                <p className="text-2xl font-bold">
                  {estatisticas.totalEstoque} unid.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Valor em Estoque</p>
                <p className="text-2xl font-bold">
                  {formatarMoeda(estatisticas.valorTotal)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Tipo mais comum</p>
                <p className="text-2xl font-bold capitalize">
                  {
                    Object.entries(estatisticas.porTipo).sort(
                      (a, b) => b[1] - a[1]
                    )[0][0]
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Formulário de Cadastro/Edição */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              {modoEdicao ? "Editar Sacola" : "Cadastrar Nova Sacola"}
            </h2>
            <p className="text-gray-600 mb-4">
              {modoEdicao
                ? "Edite as informações da sacola selecionada."
                : "Cadastre novos modelos de sacolas sustentáveis para seu catálogo."}
            </p>

            {alert.visible && (
              <AlertComponent
                tipo={alert.tipo}
                texto={alert.texto}
                onClose={closeAlert}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nome da Sacola
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Sacola Ecológica Premium"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label
                      htmlFor="tipo"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tipo/Tamanho
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="pequena">Pequena</option>
                      <option value="media">Média</option>
                      <option value="grande">Grande</option>
                      <option value="personalizada">Personalizada</option>
                    </select>
                  </div>

                  {/* Material */}
                  <div>
                    <label
                      htmlFor="material"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Material
                    </label>
                    <select
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="papel">Papel Reciclado</option>
                      <option value="algodao">Algodão</option>
                      <option value="juta">Juta</option>
                      <option value="bioplastico">Bioplástico</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="space-y-4">
                  {/* Preço */}
                  <div>
                    <label
                      htmlFor="preco"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      id="preco"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 25.90"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  {/* Estoque */}
                  <div>
                    <label
                      htmlFor="estoque"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Estoque
                    </label>
                    <input
                      type="number"
                      id="estoque"
                      name="estoque"
                      value={formData.estoque}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 100"
                      min="0"
                      required
                    />
                  </div>

                  {/* URL da Imagem */}
                  <div>
                    <label
                      htmlFor="imagemUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      URL da Imagem
                    </label>
                    <input
                      type="text"
                      id="imagemUrl"
                      name="imagemUrl"
                      value={formData.imagemUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                {/* Coluna 3 */}
                <div className="space-y-4">
                  {/* Dimensões */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="largura"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Largura (cm)
                      </label>
                      <input
                        type="number"
                        id="largura"
                        name="largura"
                        value={formData.largura}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: 30"
                        min="0"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="altura"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        id="altura"
                        name="altura"
                        value={formData.altura}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: 40"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Índice de Sustentabilidade */}
                  <div>
                    <label
                      htmlFor="sustentabilidade"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Índice de Sustentabilidade
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((nivel) => (
                        <button
                          key={nivel}
                          type="button"
                          className="focus:outline-none"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              sustentabilidade: nivel,
                            }))
                          }
                        >
                          <span
                            className={`text-2xl ${
                              formData.sustentabilidade >= nivel
                                ? "text-green-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <label
                      htmlFor="descricao"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Descrição
                    </label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Descreva a sacola, seus materiais e uso..."
                    />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  {modoEdicao ? "Salvar Alterações" : "Cadastrar Sacola"}
                </button>
                {modoEdicao && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Listagem de Sacolas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-green-700">
              Sacolas Cadastradas
            </h2>

            {/* Barra de Ferramentas */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Busca */}
              <div className="flex">
                <input
                  type="text"
                  value={buscaTermo}
                  onChange={(e) => setBuscaTermo(e.target.value)}
                  placeholder="Buscar sacolas..."
                  className="px-4 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={buscarSacolas}
                  className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                >
                  <i className="bx bx-search"></i>
                </button>
              </div>

              {/* Botão de filtros */}
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              >
                <i className="bx bx-filter-alt mr-1"></i> Filtros
              </button>

              {/* Alternar visualização */}
              <div className="flex rounded-md overflow-hidden border border-gray-300">
                <button
                  onClick={() => setView("cards")}
                  className={`px-3 py-2 ${
                    view === "cards"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <i className="bx bx-grid-alt"></i>
                </button>
                <button
                  onClick={() => setView("lista")}
                  className={`px-3 py-2 ${
                    view === "lista"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <i className="bx bx-list-ul"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Painel de filtros */}
          {mostrarFiltros && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Filtros Avançados</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordenar por
                  </label>
                  <select
                    value={filtros.ordenarPor}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        ordenarPor: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="nome">Nome</option>
                    <option value="preco">Preço</option>
                    <option value="estoque">Estoque</option>
                    <option value="data">Data de Cadastro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordem
                  </label>
                  <select
                    value={filtros.ordem}
                    onChange={(e) =>
                      setFiltros({ ...filtros, ordem: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="asc">Crescente</option>
                    <option value="desc">Decrescente</option>
                  </select>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <button
                    onClick={aplicarFiltros}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={resetarFiltros}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          )}

          {sacolas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                Nenhuma sacola encontrada. Cadastre um novo modelo!
              </p>
            </div>
          ) : (
            <>
              {/* Visualização em Cards */}
              {view === "cards" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sacolas.map((sacola) => (
                    <div
                      key={sacola.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Imagem da sacola */}
                      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={"/bag.png"}
                          alt={""}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Informações da sacola */}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              {sacola.nome}
                            </h3>
                            <p className="text-gray-600 capitalize mb-1">
                              {sacola.material}, {sacola.tipo}
                            </p>
                          </div>
                          {sacola.popular && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>

                        {/* Sustentabilidade */}
                        {renderSustentabilidade(sacola.sustentabilidade)}

                        <p className="text-lg font-bold text-green-600 mt-2">
                          {formatarMoeda(sacola.preco)}
                        </p>

                        {/* Dimensões e estoque */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sacola.largura && sacola.altura && (
                            <span className="text-sm text-gray-500">
                              {sacola.largura}×{sacola.altura} cm
                            </span>
                          )}

                          <span className="text-sm text-gray-500">
                            Estoque: {sacola.estoque} unid.
                          </span>
                        </div>

                        {/* Descrição resumida */}
                        {sacola.descricao && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {sacola.descricao}
                          </p>
                        )}

                        {/* Ações */}
                        <div className="mt-4 flex justify-between">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarSacola(sacola)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                              title="Editar"
                            >
                              <i className="bx bx-edit"></i>
                            </button>
                            <button
                              onClick={() => handleExcluirSacola(sacola.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                              title="Excluir"
                            >
                              <i className="bx bx-trash"></i>
                            </button>
                            <button
                              onClick={() => togglePopular(sacola.id)}
                              className={`p-2 ${
                                sacola.popular
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              } hover:bg-gray-50 rounded-md`}
                              title={
                                sacola.popular
                                  ? "Remover dos populares"
                                  : "Marcar como popular"
                              }
                            >
                              <i className="bx bx-star"></i>
                            </button>
                          </div>
                          <span className="text-xs text-gray-400 self-end">
                            {sacola.dataCadastro}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Visualização em Lista */}
              {view === "lista" && (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome da Sacola
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo/Material
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estoque
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sustentabilidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Cadastro
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sacolas.map((sacola) => (
                        <tr key={sacola.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  src={"/bag.png"}
                                  alt={""}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {sacola.nome}
                                </div>
                                {sacola.popular && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                                    Popular
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="capitalize">{sacola.tipo}</div>
                            <div className="text-sm text-gray-500 capitalize">
                              {sacola.material}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                            {formatarMoeda(sacola.preco)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {sacola.estoque} unid.
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderSustentabilidade(sacola.sustentabilidade)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sacola.dataCadastro}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditarSacola(sacola)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                                title="Editar"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                              <button
                                onClick={() => handleExcluirSacola(sacola.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                title="Excluir"
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                              <button
                                onClick={() => togglePopular(sacola.id)}
                                className={`p-1.5 ${
                                  sacola.popular
                                    ? "text-yellow-500"
                                    : "text-gray-400"
                                } hover:bg-gray-50 rounded-md`}
                                title={
                                  sacola.popular
                                    ? "Remover dos populares"
                                    : "Marcar como popular"
                                }
                              >
                                <i className="bx bx-star"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastroSacolasPage;
