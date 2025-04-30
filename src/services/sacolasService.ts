// Tipos de dados
export interface Sacola {
  id: string;
  nome: string;
  tipo: "pequena" | "media" | "grande" | "personalizada";
  material: "papel" | "algodao" | "juta" | "bioplastico" | "outro";
  largura?: number;
  altura?: number;
  preco: number;
  estoque: number;
  descricao?: string;
  dataCadastro: string;
  imagemUrl?: string; // Novo campo para URL da imagem
  sustentabilidade?: number; // Índice de 1-5 para classificar sustentabilidade
  popular?: boolean; // Marcador para produtos populares
}

export interface FiltroSacolas {
  tipo?: Sacola["tipo"][];
  material?: Sacola["material"][];
  precoMin?: number;
  precoMax?: number;
  ordenarPor?: "nome" | "preco" | "estoque" | "data";
  ordem?: "asc" | "desc";
}

// Amostra de dados para desenvolvimento
const sacolasIniciais: Sacola[] = [
  {
    id: "sac-001",
    nome: "Eco-Bag Standard",
    tipo: "media",
    material: "papel",
    largura: 30,
    altura: 40,
    preco: 12.9,
    estoque: 350,
    descricao: "Sacola ecológica padrão de papel reciclado",
    dataCadastro: "15/03/2025",
    imagemUrl: "/sacolas/ecobag-standard.jpg",
    sustentabilidade: 4,
    popular: true,
  },
  {
    id: "sac-002",
    nome: "Sacola Premium",
    tipo: "grande",
    material: "algodao",
    largura: 40,
    altura: 45,
    preco: 19.9,
    estoque: 150,
    descricao: "Sacola premium de algodão natural",
    dataCadastro: "20/03/2025",
    imagemUrl: "/sacolas/premium.jpg",
    sustentabilidade: 5,
  },
  {
    id: "sac-003",
    nome: "Mini Eco",
    tipo: "pequena",
    material: "juta",
    largura: 20,
    altura: 25,
    preco: 8.5,
    estoque: 200,
    descricao: "Sacola pequena de juta sustentável",
    dataCadastro: "10/04/2025",
    imagemUrl: "/sacolas/mini-eco.jpg",
    sustentabilidade: 4,
    popular: true,
  },
  {
    id: "sac-004",
    nome: "Ecológica Plus",
    tipo: "grande",
    material: "bioplastico",
    largura: 45,
    altura: 50,
    preco: 22.5,
    estoque: 100,
    descricao: "Sacola grande de bioplástico biodegradável",
    dataCadastro: "05/04/2025",
    imagemUrl: "/sacolas/ecologica-plus.jpg",
    sustentabilidade: 5,
  },
  {
    id: "sac-005",
    nome: "Compacta Sustentável",
    tipo: "pequena",
    material: "papel",
    largura: 15,
    altura: 20,
    preco: 6.9,
    estoque: 400,
    descricao: "Sacola pequena de papel 100% reciclado",
    dataCadastro: "12/04/2025",
    imagemUrl: "/sacolas/compacta.jpg",
    sustentabilidade: 3,
    popular: true,
  },
];

// Classe de serviço
class SacolasService {
  private sacolas: Sacola[] = [...sacolasIniciais];
  private localStorageKey = "sustenta_bag_sacolas";

  constructor() {
    this.carregarDadosLocais();
  }

  // Salvar dados no localStorage
  private salvarDadosLocais(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.sacolas));
    }
  }

  // Carregar dados do localStorage
  private carregarDadosLocais(): void {
    if (typeof window !== "undefined") {
      const dadosSalvos = localStorage.getItem(this.localStorageKey);
      if (dadosSalvos) {
        try {
          this.sacolas = JSON.parse(dadosSalvos);
        } catch (e) {
          console.error("Erro ao carregar dados do localStorage:", e);
        }
      }
    }
  }

  // Obter todas as sacolas
  obterTodas(): Sacola[] {
    return [...this.sacolas];
  }

  // Obter sacola por ID
  obterPorId(id: string): Sacola | undefined {
    return this.sacolas.find((sacola) => sacola.id === id);
  }

  // Buscar sacolas por nome ou descrição
  buscarSacolas(termo: string): Sacola[] {
    if (!termo) return this.obterTodas();

    const termoLowerCase = termo.toLowerCase();
    return this.sacolas.filter(
      (sacola) =>
        sacola.nome.toLowerCase().includes(termoLowerCase) ||
        sacola.descricao?.toLowerCase().includes(termoLowerCase)
    );
  }

  // Filtrar sacolas com opções avançadas
  filtrarSacolas(filtros: FiltroSacolas): Sacola[] {
    let resultado = [...this.sacolas];

    // Aplicar filtros
    if (filtros.tipo && filtros.tipo.length > 0) {
      resultado = resultado.filter((s) => filtros.tipo?.includes(s.tipo));
    }

    if (filtros.material && filtros.material.length > 0) {
      resultado = resultado.filter((s) =>
        filtros.material?.includes(s.material)
      );
    }

    if (filtros.precoMin !== undefined) {
      resultado = resultado.filter((s) => s.preco >= filtros.precoMin!);
    }

    if (filtros.precoMax !== undefined) {
      resultado = resultado.filter((s) => s.preco <= filtros.precoMax!);
    }

    // Aplicar ordenação
    if (filtros.ordenarPor) {
      resultado.sort((a, b) => {
        const ordem = filtros.ordem === "desc" ? -1 : 1;

        switch (filtros.ordenarPor) {
          case "nome":
            return ordem * a.nome.localeCompare(b.nome);
          case "preco":
            return ordem * (a.preco - b.preco);
          case "estoque":
            return ordem * (a.estoque - b.estoque);
          case "data":
            return (
              ordem *
              (new Date(
                a.dataCadastro.split("/").reverse().join("-")
              ).getTime() -
                new Date(
                  b.dataCadastro.split("/").reverse().join("-")
                ).getTime())
            );
          default:
            return 0;
        }
      });
    }

    return resultado;
  }

  // Obter sacolas populares
  obterSacolasPopulares(): Sacola[] {
    return this.sacolas.filter((s) => s.popular);
  }

  // Adicionar nova sacola
  adicionarSacola(sacola: Omit<Sacola, "id" | "dataCadastro">): Sacola {
    // Gerar ID simulado
    const novoId = `sac-${String(this.sacolas.length + 1).padStart(3, "0")}`;

    // Obter data atual formatada
    const hoje = new Date();
    const dataFormatada = `${hoje.getDate().toString().padStart(2, "0")}/${(
      hoje.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${hoje.getFullYear()}`;

    // Usar imagem padrão se não for fornecida uma URL de imagem
    const imagemUrl =
      sacola.imagemUrl && sacola.imagemUrl.trim() !== ""
        ? sacola.imagemUrl
        : "/bag.png";

    const novaSacola: Sacola = {
      ...sacola,
      id: novoId,
      dataCadastro: dataFormatada,
      imagemUrl: imagemUrl,
    };

    this.sacolas.push(novaSacola);
    this.salvarDadosLocais();
    return novaSacola;
  }

  // Atualizar sacola existente
  atualizarSacola(
    id: string,
    dadosAtualizados: Partial<Omit<Sacola, "id" | "dataCadastro">>
  ): Sacola | null {
    const index = this.sacolas.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.sacolas[index] = {
      ...this.sacolas[index],
      ...dadosAtualizados,
    };

    this.salvarDadosLocais();
    return this.sacolas[index];
  }

  // Atualizar estoque
  atualizarEstoque(id: string, quantidade: number): Sacola | null {
    const index = this.sacolas.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.sacolas[index] = {
      ...this.sacolas[index],
      estoque: this.sacolas[index].estoque + quantidade,
    };

    this.salvarDadosLocais();
    return this.sacolas[index];
  }

  // Marcar/desmarcar como popular
  togglePopular(id: string): Sacola | null {
    const index = this.sacolas.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.sacolas[index] = {
      ...this.sacolas[index],
      popular: !this.sacolas[index].popular,
    };

    this.salvarDadosLocais();
    return this.sacolas[index];
  }

  // Definir índice de sustentabilidade
  definirSustentabilidade(id: string, indice: number): Sacola | null {
    if (indice < 1 || indice > 5) {
      throw new Error("O índice de sustentabilidade deve ser entre 1 e 5");
    }

    const index = this.sacolas.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.sacolas[index] = {
      ...this.sacolas[index],
      sustentabilidade: indice,
    };

    this.salvarDadosLocais();
    return this.sacolas[index];
  }

  // Remover sacola
  removerSacola(id: string): boolean {
    const index = this.sacolas.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.sacolas.splice(index, 1);
    this.salvarDadosLocais();
    return true;
  }

  // Obter estatísticas do estoque
  obterEstatisticas() {
    const total = this.sacolas.length;
    const totalEstoque = this.sacolas.reduce((acc, s) => acc + s.estoque, 0);
    const valorTotal = this.sacolas.reduce(
      (acc, s) => acc + s.preco * s.estoque,
      0
    );

    const porTipo = this.sacolas.reduce((acc, s) => {
      if (!acc[s.tipo]) acc[s.tipo] = 0;
      acc[s.tipo] += s.estoque;
      return acc;
    }, {} as Record<string, number>);

    const porMaterial = this.sacolas.reduce((acc, s) => {
      if (!acc[s.material]) acc[s.material] = 0;
      acc[s.material] += s.estoque;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      totalEstoque,
      valorTotal,
      porTipo,
      porMaterial,
    };
  }
}

// Exportar uma instância única do serviço
export const sacolasService = new SacolasService();
