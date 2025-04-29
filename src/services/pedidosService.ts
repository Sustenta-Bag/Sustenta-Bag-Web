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

  // Atualizar status de um pedido
  atualizarStatus: (id: string, novoStatus: PedidoStatus): Pedido | null => {
    const pedidoIndex = MOCK_PEDIDOS.findIndex((p) => p.id === id);

    if (pedidoIndex === -1) return null;

    // Em um ambiente real, aqui seria uma chamada PUT para a API
    MOCK_PEDIDOS[pedidoIndex].status = novoStatus;

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
