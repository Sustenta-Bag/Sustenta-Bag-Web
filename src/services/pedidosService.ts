// Define os tipos para um pedido
export type PedidoStatus = "pendente" | "aceito" | "concluido" | "recusado";

export interface Pedido {
  id: string;
  cliente: string;
  produto: string;
  data: string;
  valor: number;
  status: "pendente" | "aceito" | "concluido" | "recusado";
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  quantidadeSacolas?: number;
  historico?: { status: string; data: string; hora: string }[];
}

// Mock de dados para desenvolvimento frontend
export const MOCK_PEDIDOS: Pedido[] = [
  {
    id: "PED-001",
    cliente: "Maria Silva",
    produto: "Sacola Ecológica Grande",
    data: "28/04/2025",
    valor: 25.9,
    status: "pendente",
    endereco: "Rua das Flores, 123",
    telefone: "(11) 98765-4321",
    quantidadeSacolas: 5,
  },
  {
    id: "PED-002",
    cliente: "João Santos",
    produto: "Sacola Ecológica Pequena",
    data: "27/04/2025",
    valor: 15.5,
    status: "aceito",
    endereco: "Av. Principal, 456",
    telefone: "(11) 91234-5678",
    quantidadeSacolas: 3,
  },
  {
    id: "PED-003",
    cliente: "Ana Oliveira",
    produto: "Kit Sacolas Sustentáveis",
    data: "25/04/2025",
    valor: 42.8,
    status: "concluido",
    endereco: "Rua das Árvores, 789",
    telefone: "(11) 98523-1472",
    quantidadeSacolas: 8,
  },
  {
    id: "PED-004",
    cliente: "Carlos Mendes",
    produto: "Sacola Ecológica Média",
    data: "24/04/2025",
    valor: 19.9,
    status: "recusado",
    endereco: "Travessa da Paz, 456",
    telefone: "(11) 97412-3698",
    observacoes: "Cliente cancelou o pedido",
    quantidadeSacolas: 4,
  },
  {
    id: "PED-005",
    cliente: "Fernanda Lima",
    produto: "Sacola Ecológica Grande",
    data: "28/04/2025",
    valor: 25.9,
    status: "pendente",
    endereco: "Alameda dos Anjos, 123",
    telefone: "(11) 99874-5612",
    quantidadeSacolas: 5,
  },
  {
    id: "PED-006",
    cliente: "Roberto Alves",
    produto: "Sacola Ecológica Pequena",
    data: "26/04/2025",
    valor: 15.5,
    status: "aceito",
    endereco: "Rua dos Pinheiros, 789",
    telefone: "(11) 98741-2365",
    quantidadeSacolas: 3,
  },
  {
    id: "PED-007",
    cliente: "Juliana Costa",
    produto: "Kit Sacolas Sustentáveis",
    data: "23/04/2025",
    valor: 42.8,
    status: "concluido",
    endereco: "Avenida Central, 1010",
    telefone: "(11) 97845-6321",
    quantidadeSacolas: 8,
  },
  {
    id: "PED-008",
    cliente: "Marcelo Souza",
    produto: "Sacola Ecológica Grande",
    data: "21/04/2025",
    valor: 25.9,
    status: "pendente",
    endereco: "Praça da Liberdade, 50",
    telefone: "(11) 99632-1478",
    quantidadeSacolas: 5,
  },
  {
    id: "PED-009",
    cliente: "Paula Teixeira",
    produto: "Sacola Ecológica Média",
    data: "20/04/2025",
    valor: 19.9,
    status: "pendente",
    endereco: "Rua Bela Vista, 222",
    telefone: "(11) 96587-1247",
    quantidadeSacolas: 4,
  },
  {
    id: "PED-010",
    cliente: "Eduardo Ramos",
    produto: "Kit Sacolas Sustentáveis",
    data: "18/04/2025",
    valor: 42.8,
    status: "aceito",
    endereco: "Av. das Nações, 900",
    telefone: "(11) 97214-8874",
    quantidadeSacolas: 8,
  },
  {
    id: "PED-011",
    cliente: "Beatriz Martins",
    produto: "Sacola Ecológica Pequena",
    data: "17/04/2025",
    valor: 15.5,
    status: "concluido",
    endereco: "Rua do Sol, 75",
    telefone: "(11) 96412-7789",
    quantidadeSacolas: 3,
  },
  {
    id: "PED-012",
    cliente: "Ricardo Lima",
    produto: "Sacola Ecológica Grande",
    data: "15/04/2025",
    valor: 25.9,
    status: "recusado",
    endereco: "Rua Verdejante, 321",
    telefone: "(11) 97132-4488",
    observacoes: "Endereço incorreto",
    quantidadeSacolas: 5,
  },
  {
    id: "PED-013",
    cliente: "Luciana Dias",
    produto: "Sacola Ecológica Média",
    data: "13/04/2025",
    valor: 19.9,
    status: "pendente",
    endereco: "Rua Esperança, 88",
    telefone: "(11) 97321-4487",
    quantidadeSacolas: 4,
  },
  {
    id: "PED-014",
    cliente: "André Barbosa",
    produto: "Kit Sacolas Sustentáveis",
    data: "12/04/2025",
    valor: 42.8,
    status: "concluido",
    endereco: "Av. Industrial, 300",
    telefone: "(11) 97548-9632",
    quantidadeSacolas: 8,
  },
  {
    id: "PED-015",
    cliente: "Sabrina Rocha",
    produto: "Sacola Ecológica Grande",
    data: "10/04/2025",
    valor: 25.9,
    status: "aceito",
    endereco: "Rua dos Cravos, 154",
    telefone: "(11) 98325-7412",
    quantidadeSacolas: 5,
  },
  {
    id: "PED-016",
    cliente: "Renato Cunha",
    produto: "Sacola Ecológica Pequena",
    data: "09/04/2025",
    valor: 15.5,
    status: "pendente",
    endereco: "Rua Horizonte Azul, 67",
    telefone: "(11) 96258-3541",
    quantidadeSacolas: 3,
  },
  {
    id: "PED-017",
    cliente: "Mariana Torres",
    produto: "Sacola Ecológica Média",
    data: "07/04/2025",
    valor: 19.9,
    status: "recusado",
    endereco: "Travessa das Águas, 908",
    telefone: "(11) 97621-0045",
    observacoes: "Produto fora de estoque",
    quantidadeSacolas: 4,
  },
  {
    id: "PED-018",
    cliente: "Thiago Ferreira",
    produto: "Kit Sacolas Sustentáveis",
    data: "05/04/2025",
    valor: 42.8,
    status: "concluido",
    endereco: "Av. do Progresso, 501",
    telefone: "(11) 98412-7754",
    quantidadeSacolas: 8,
  },
  {
    id: "PED-019",
    cliente: "Carla Nogueira",
    produto: "Sacola Ecológica Pequena",
    data: "03/04/2025",
    valor: 15.5,
    status: "aceito",
    endereco: "Rua da União, 12",
    telefone: "(11) 98124-3367",
    quantidadeSacolas: 3,
  },
  {
    id: "PED-020",
    cliente: "Fábio Andrade",
    produto: "Sacola Ecológica Grande",
    data: "01/04/2025",
    valor: 25.9,
    status: "pendente",
    endereco: "Av. Brasil, 777",
    telefone: "(11) 98763-1123",
    quantidadeSacolas: 5,
  },
];

// Serviço para gerenciar os pedidos
export const pedidosService = {
  // Expor o array de pedidos diretamente
  pedidosMock: MOCK_PEDIDOS,

  // Obter todos os pedidos
  obterTodos: (): Pedido[] => {
    // No futuro, aqui seria uma chamada à API
    return [...MOCK_PEDIDOS];
  },

  // Obter pedido por ID
  obterPorId: (id: string): Pedido | undefined => {
    return MOCK_PEDIDOS.find((pedido) => pedido.id === id);
  },

  // Obter pedidos por status
  obterPorStatus: (status: PedidoStatus): Pedido[] => {
    return MOCK_PEDIDOS.filter((pedido) => pedido.status === status);
  },
  // Adicionar ao histórico de um pedido
  adicionarAoHistorico: (
    id: string,
    status: PedidoStatus
  ): { status: string; data: string; hora: string }[] | null => {
    const pedidoIndex = MOCK_PEDIDOS.findIndex((p) => p.id === id);
    if (pedidoIndex === -1) return null;

    const dataAtual = new Date();
    const dataFormatada = `${String(dataAtual.getDate()).padStart(
      2,
      "0"
    )}/${String(dataAtual.getMonth() + 1).padStart(
      2,
      "0"
    )}/${dataAtual.getFullYear()}`;
    const horaFormatada = `${String(dataAtual.getHours()).padStart(
      2,
      "0"
    )}:${String(dataAtual.getMinutes()).padStart(2, "0")}`;

    if (!MOCK_PEDIDOS[pedidoIndex].historico) {
      MOCK_PEDIDOS[pedidoIndex].historico = [];
    }

    MOCK_PEDIDOS[pedidoIndex].historico!.push({
      status,
      data: dataFormatada,
      hora: horaFormatada,
    });

    return MOCK_PEDIDOS[pedidoIndex].historico!;
  },

  atualizarStatus: (id: string, novoStatus: PedidoStatus): Pedido | null => {
    const pedidoIndex = MOCK_PEDIDOS.findIndex((p) => p.id === id);

    if (pedidoIndex === -1) return null;

    // Em um ambiente real, aqui seria uma chamada PUT para a API
    MOCK_PEDIDOS[pedidoIndex].status = novoStatus;

    // Adicionar ao histórico diretamente aqui
    // Obter data e hora atuais formatadas
    const dataAtual = new Date();
    const dataFormatada = `${String(dataAtual.getDate()).padStart(
      2,
      "0"
    )}/${String(dataAtual.getMonth() + 1).padStart(
      2,
      "0"
    )}/${dataAtual.getFullYear()}`;
    const horaFormatada = `${String(dataAtual.getHours()).padStart(
      2,
      "0"
    )}:${String(dataAtual.getMinutes()).padStart(2, "0")}`;

    // Se não existir histórico, criar um array vazio
    if (!MOCK_PEDIDOS[pedidoIndex].historico) {
      MOCK_PEDIDOS[pedidoIndex].historico = [];
    }

    // Adicionar novo registro ao histórico
    MOCK_PEDIDOS[pedidoIndex].historico!.push({
      status: novoStatus,
      data: dataFormatada,
      hora: horaFormatada,
    });

    return MOCK_PEDIDOS[pedidoIndex];
  },

  // Criar novo pedido
  criar: (pedido: Omit<Pedido, "id">): Pedido => {
    // Gerar um ID (em um ambiente real, o backend cuidaria disso)
    const novoId = `PED-${String(MOCK_PEDIDOS.length + 1).padStart(3, "0")}`;

    const novoPedido: Pedido = {
      id: novoId,
      ...pedido,
    };

    // Em um ambiente real, aqui seria uma chamada POST para a API
    MOCK_PEDIDOS.push(novoPedido);

    return novoPedido;
  },

  // Obter estatísticas de pedidos
  obterEstatisticas: () => {
    const total = MOCK_PEDIDOS.length;
    const pendentes = MOCK_PEDIDOS.filter(
      (p) => p.status === "pendente"
    ).length;
    const aceitos = MOCK_PEDIDOS.filter((p) => p.status === "aceito").length;
    const concluidos = MOCK_PEDIDOS.filter(
      (p) => p.status === "concluido"
    ).length;
    const recusados = MOCK_PEDIDOS.filter(
      (p) => p.status === "recusado"
    ).length;

    const valorTotal = MOCK_PEDIDOS.filter(
      (p) => p.status !== "recusado"
    ).reduce((sum, pedido) => sum + pedido.valor, 0);

    return {
      total,
      pendentes,
      aceitos,
      concluidos,
      recusados,
      valorTotal,
    };
  },
};
