"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import AlertComponent from "@/components/alertComponent/Alert";
import { Sacola, sacolasService } from "@/services/sacolasService";

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
  });

  const [sacolas, setSacolas] = useState<Sacola[]>([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [sacolaEmEdicaoId, setSacolaEmEdicaoId] = useState<string | null>(null);
  const [buscaTermo, setBuscaTermo] = useState("");

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

  // Carregar sacolas ao iniciar
  useEffect(() => {
    carregarSacolas();
  }, []);

  const carregarSacolas = () => {
    const sacolasCarregadas = sacolasService.obterTodas();
    setSacolas(sacolasCarregadas);
  };

  const buscarSacolas = () => {
    const sacolasEncontradas = sacolasService.buscarSacolas(buscaTermo);
    setSacolas(sacolasEncontradas);
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
        // Atualização de sacola não está implementada no serviço ainda
        // Seria necessário adicionar essa funcionalidade no sacolasService
        setAlert({
          visible: true,
          texto: "Função de edição ainda não implementada completamente",
          tipo: "info",
        });
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
        });

        setAlert({
          visible: true,
          texto: "Sacola cadastrada com sucesso!",
          tipo: "success",
        });

        // Recarregar a lista de sacolas
        carregarSacolas();
      }

      // Limpar formulário
      resetForm();
    } catch (erro) {
      console.error(erro);
      setAlert({
        visible: true,
        texto:
          "Erro ao cadastrar sacola. Verifique os dados e tente novamente.",
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
      } else {
        setAlert({
          visible: true,
          texto: "Erro ao remover sacola.",
          tipo: "error",
        });
      }
    }
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Navbar title="Sustenta Bag" links={navLinks} logoSrc="/Star.png" />

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">
                {modoEdicao ? "Editar Sacola" : "Cadastro de Sacolas"}
              </h1>
              <p className="text-gray-600 mb-4">
                {modoEdicao
                  ? "Edite as informações da sacola selecionada."
                  : "Cadastre novos modelos de sacolas sustentáveis para seu catálogo."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="papel">Papel Reciclado</option>
                      <option value="algodao">Algodão</option>
                      <option value="juta">Juta</option>
                      <option value="bioplastico">Bioplástico</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 25.90"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  {/* Dimensões */}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 40"
                      min="0"
                    />
                  </div>

                  {/* Estoque */}
                  <div>
                    <label
                      htmlFor="estoque"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantidade em Estoque
                    </label>
                    <input
                      type="number"
                      id="estoque"
                      name="estoque"
                      value={formData.estoque}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 100"
                      min="0"
                      required
                    />
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
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição detalhada do produto..."
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={resetForm}
                  >
                    {modoEdicao ? "Cancelar" : "Limpar"}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {modoEdicao ? "Salvar Alterações" : "Cadastrar"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Campo de busca */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={buscaTermo}
                onChange={(e) => setBuscaTermo(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar por nome ou descrição..."
              />
              <button
                onClick={buscarSacolas}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Buscar
              </button>
              <button
                onClick={() => {
                  setBuscaTermo("");
                  carregarSacolas();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Listagem de sacolas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sacolas Cadastradas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sacolas.length > 0 ? (
                    sacolas.map((sacola) => (
                      <tr key={sacola.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sacola.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">
                          {sacola.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">
                          {sacola.material === "papel"
                            ? "Papel Reciclado"
                            : sacola.material === "algodao"
                            ? "Algodão"
                            : sacola.material === "juta"
                            ? "Juta"
                            : sacola.material === "bioplastico"
                            ? "Bioplástico"
                            : "Outro"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          R$ {sacola.preco.toFixed(2).replace(".", ",")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sacola.estoque}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditarSacola(sacola)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleExcluirSacola(sacola.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        Nenhuma sacola encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

export default CadastroSacolasPage;
