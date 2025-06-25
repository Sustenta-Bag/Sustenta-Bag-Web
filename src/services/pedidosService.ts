// Define os tipos para um pedido
export type PedidoStatus =
  | "pendente"
  | "confirmado"
  | "pago"
  | "preparando"
  | "pronto"
  | "entregue"
  | "cancelado";

export interface Pedido {
  id: string;
  cliente: string;
  produto: string;
  data: string;
  valor: number;
  status: PedidoStatus;
  telefone?: string;
  endereco?: string;
  observacoes?: string;
  quantidadeSacolas?: number;
  historico?: { status: string; data: string; hora: string }[];
}

// Interface para a resposta da API
export interface PedidosServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4041/api";

// Mock de dados para desenvolvimento frontend
const MOCK_PEDIDOS: Pedido[] = [
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
    status: "confirmado",
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
    status: "entregue",
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
    status: "cancelado",
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
    status: "confirmado",
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
    status: "entregue",
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
    status: "confirmado",
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
    status: "pronto",
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
    status: "cancelado",
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
    status: "entregue",
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
    status: "confirmado",
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
    status: "cancelado",
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
    status: "entregue",
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
    status: "confirmado",
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

// Interfaces para os dados da API
interface OrderAddressAPI {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode?: string;
  complement?: string;
}

interface OrderHistoryItemAPI {
  status: number;
  date: string;
}

interface OrderAPI {
  id: number | string;
  idClient: number;
  idBusiness: number;
  clientName?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: number;
    idOrder: number;
    idBag: number;
    quantity: number;
    price: string;
    createdAt: string;
    updatedAt: string;
  }[];
  reviewed: boolean;
  _links: {
    rel: string;
    href: string;
    method: string;
  }[];
}

// Serviço para gerenciar os pedidos
class PedidosService {
  private _pedidosMock: Pedido[] = MOCK_PEDIDOS; // Mantém mock apenas para desenvolvimento/testes específicos
  private _pedidosCache: Pedido[] = [];

  private _estatisticas = {
    total: 0,
    pendentes: 0,
    confirmados: 0,
    concluidos: 0,
    recusados: 0,
    valorTotal: 0,
  };

  constructor() {
    // Inicializa com cache vazio e estatísticas zeradas
    this._pedidosCache = [];
    this.calcularEstatisticas();
  }
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token de autenticação não encontrado no localStorage");
      }
      return token;
    }
    return null;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private getBusinessId(): number | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData.idBusiness || null;
        } catch (error) {
          console.error("Erro ao obter ID do negócio:", error);
          return null;
        }
      }
    }
    return null;
  } // Busca os pedidos da API
  async getOrdersByBusiness(): Promise<PedidosServiceResponse<Pedido[]>> {
    try {
      const businessId = this.getBusinessId();

      if (!businessId) {
        console.warn("ID do negócio não encontrado");
        this._pedidosCache = []; // Define cache como array vazio
        this.calcularEstatisticas();
        return {
          success: false,
          data: [],
          message: "ID do negócio não encontrado",
        };
      }

      const headers = this.getAuthHeaders();
      // Log para debug
      console.log(`Buscando pedidos para o negócio ID: ${businessId}`);
      console.log(`URL: ${API_BASE_URL}/orders/?idBusiness=/${businessId}`);
      console.log(
        `Com token de autenticação: ${this.getAuthToken() ? "Sim" : "Não"}`
      );

      const response = await fetch(
        `${API_BASE_URL}/orders/?idBusiness=${businessId}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response.ok) {
        const errorMessage = `Erro na resposta da API: ${response.status} ${response.statusText}`;
        console.warn(errorMessage);
        this._pedidosCache = []; // Define cache como array vazio
        this.calcularEstatisticas();

        return {
          success: false,
          data: [],
          message: "Erro ao buscar pedidos do servidor",
        };
      }

      const data = await response.json();

      const pedidosApi = data.data;

      if (!pedidosApi || !Array.isArray(pedidosApi) || pedidosApi.length === 0) {
        this._pedidosCache = [];
        this.calcularEstatisticas();
        return {
          success: true,
          data: [],
          message: "Nenhum pedido encontrado",
        };
      }

      // Mapear os dados da API para o formato esperado pelo frontend
      this._pedidosCache = this.mapearPedidosApi(pedidosApi);
      this.calcularEstatisticas();

      return {
        success: true,
        data: this._pedidosCache,
      };
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);

      // Em caso de erro, retornar array vazio
      this._pedidosCache = [];
      this.calcularEstatisticas();

      return {
        success: false,
        data: [],
        message: "Erro de conexão com o servidor",
      };
    }
  } // Função para mapear os dados da API para o formato esperado pelo frontend
  private mapearPedidosApi(apiData: OrderAPI[]): Pedido[] {
    return apiData.map((order) => ({
      id: order.id.toString(),
      cliente: (order as any).clientName || "",
      produto:
        order.items && order.items.length > 0
          ? `Sacola #${order.items[0].idBag}`
          : "Sacola",
      data: this.formatarData(new Date(order.createdAt)),
      valor: order.totalAmount || 0,
      status: this.mapearStatus(order.status),
      quantidadeSacolas: order.items
        ? order.items.reduce((sum, item) => sum + item.quantity, 0)
        : 1,
      observacoes: "",
    }));
  }

  private mapearHistorico(
    historico: OrderHistoryItemAPI[]
  ): { status: string; data: string; hora: string }[] {
    if (!historico || !Array.isArray(historico)) return [];

    return historico.map((item) => {
      const data = new Date(item.date);
      return {
        status: this.mapearStatus(item.status.toString()),
        data: this.formatarData(data),
        hora: `${String(data.getHours()).padStart(2, "0")}:${String(
          data.getMinutes()
        ).padStart(2, "0")}`,
      };
    });
  }

  private formatarData(data: Date): string {
    return `${data.getDate().toString().padStart(2, "0")}/${(
      data.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${data.getFullYear()}`;
  }

  private formatarEndereco(address: OrderAddressAPI | undefined): string {
    if (!address) return "";
    return `${address.street || ""}, ${address.number || ""} - ${
      address.city || ""
    }/${address.state || ""}`;
  }

  private mapearStatus(apiStatus: string): PedidoStatus {
    const statusMap: Record<string, PedidoStatus> = {
      confirmado: "confirmado",
      pago: "pago",
      preparando: "preparando",
      pronto: "pronto",
      entregue: "entregue",
      cancelado: "cancelado",
      pendente: "pendente",
    };

    return statusMap[apiStatus] || "pendente";
  } // Métodos de acesso aos dados
  obterTodos(): Pedido[] {
    return this._pedidosCache;
  }

  obterPorId(id: string): Pedido | undefined {
    return this._pedidosCache.find((pedido) => pedido.id === id);
  }

  obterPorStatus(status: PedidoStatus): Pedido[] {
    return this._pedidosCache.filter((pedido) => pedido.status === status);
  }
  // Adicionar ao histórico de um pedido
  adicionarAoHistorico(
    id: string,
    status: PedidoStatus
  ): { status: string; data: string; hora: string }[] | null {
    const pedidoIndex = this._pedidosCache.findIndex((p) => p.id === id);
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

    if (!this._pedidosCache[pedidoIndex].historico) {
      this._pedidosCache[pedidoIndex].historico = [];
    }

    this._pedidosCache[pedidoIndex].historico!.push({
      status,
      data: dataFormatada,
      hora: horaFormatada,
    });

    return this._pedidosCache[pedidoIndex].historico!;
  } // Atualizar status de um pedido
  async atualizarStatus(
    id: string,
    novoStatus: PedidoStatus
  ): Promise<Pedido | null> {
    const pedidoIndex = this._pedidosCache.findIndex((p) => p.id === id);

    if (pedidoIndex === -1) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          status: novoStatus,
        })
      });
      
      if (!response.ok) {
        console.error(`Erro ao atualizar status do pedido: ${response.status}`);
        return null;
      }

      // Log para debug
      console.log(`Atualizando status do pedido ${id} para ${novoStatus}`);
      console.log(
        `Com token de autenticação: ${this.getAuthToken() ? "Sim" : "Não"}`
      );

      // Atualiza apenas no cache local por enquanto
      this._pedidosCache[pedidoIndex].status = novoStatus;

      // Adicionar ao histórico
      this.adicionarAoHistorico(id, novoStatus);

      // Recalcular estatísticas
      this.calcularEstatisticas();

      return this._pedidosCache[pedidoIndex];
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      return null;
    }
  }
  
  // Calcular estatísticas de pedidos
  private calcularEstatisticas(): void {
    this._estatisticas = {
      total: this._pedidosCache.length,
      pendentes: this._pedidosCache.filter((p) => p.status === "pendente")
        .length,
      confirmados: this._pedidosCache.filter((p) => p.status === "confirmado" || p.status === "pago").length,
      concluidos: this._pedidosCache.filter((p) => p.status === "entregue")
        .length,
      recusados: this._pedidosCache.filter((p) => p.status === "cancelado")
        .length,
      valorTotal: this._pedidosCache
        .filter((p) => p.status !== "cancelado")
        .reduce((sum, pedido) => sum + pedido.valor, 0),
    };
  }

  // Obter estatísticas de pedidos
  obterEstatisticas() {
    return this._estatisticas;
  }

  // Método para usar dados mock (apenas para desenvolvimento/testes)
  usarDadosMock(): PedidosServiceResponse<Pedido[]> {
    this._pedidosCache = [...this._pedidosMock];
    this.calcularEstatisticas();
    return {
      success: true,
      data: this._pedidosCache,
      message: "Usando dados mock para desenvolvimento",
    };
  }
}

// Instanciar o serviço como singleton
export const pedidosService = new PedidosService();
