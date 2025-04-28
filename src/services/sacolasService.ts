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
  },
];

// Classe de serviço
class SacolasService {
  private sacolas: Sacola[] = [...sacolasIniciais];

  // Obter todas as sacolas
  obterTodas(): Sacola[] {
    return [...this.sacolas];
  }

  // Obter sacola por ID
  obterPorId(id: string): Sacola | undefined {
    return this.sacolas.find((sacola) => sacola.id === id);
  }

  // Buscar sacolas por nome
  buscarSacolas(termo: string): Sacola[] {
    if (!termo) return this.obterTodas();

    const termoLowerCase = termo.toLowerCase();
    return this.sacolas.filter(
      (sacola) =>
        sacola.nome.toLowerCase().includes(termoLowerCase) ||
        sacola.descricao?.toLowerCase().includes(termoLowerCase)
    );
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

    const novaSacola: Sacola = {
      ...sacola,
      id: novoId,
      dataCadastro: dataFormatada,
    };

    this.sacolas.push(novaSacola);
    return novaSacola;
  }

  // Atualizar estoque
  atualizarEstoque(id: string, quantidade: number): Sacola | null {
    const index = this.sacolas.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.sacolas[index] = {
      ...this.sacolas[index],
      estoque: this.sacolas[index].estoque + quantidade,
    };

    return this.sacolas[index];
  }

  // Remover sacola
  removerSacola(id: string): boolean {
    const index = this.sacolas.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.sacolas.splice(index, 1);
    return true;
  }
}

// Exportar uma instância única do serviço
export const sacolasService = new SacolasService();
