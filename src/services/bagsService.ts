const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const ALLOWED_TAGS = [
  "PODE_CONTER_GLUTEN",
  "PODE_CONTER_LACTOSE",
  "PODE_CONTER_LEITE",
  "PODE_CONTER_OVOS",
  "PODE_CONTER_AMENDOIM",
  "PODE_CONTER_CASTANHAS",
  "PODE_CONTER_NOZES",
  "PODE_CONTER_SOJA",
  "PODE_CONTER_PEIXE",
  "PODE_CONTER_FRUTOS_DO_MAR",
  "PODE_CONTER_CRUSTACEOS",
  "PODE_CONTER_GERGELIM",
  "PODE_CONTER_SULFITOS",
  "PODE_CONTER_CARNE",
] as const;

export type BagTag = (typeof ALLOWED_TAGS)[number];

export interface Bag {
  id: number;
  type: "Doce" | "Salgada" | "Mista";
  price: number;
  description: string;
  idBusiness: number;
  status: number;
  tags: BagTag[];
  createdAt: string;
}

export interface CreateBagRequest {
  type: "Doce" | "Salgada" | "Mista";
  price: number;
  description: string;
  idBusiness: number;
  status: number;
  tags: BagTag[];
}

export interface UpdateBagRequest {
  type: "Doce" | "Salgada" | "Mista";
  price: number;
  description: string;
  idBusiness: number;
  status: number;
  tags: BagTag[];
}

export interface BagsServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class BagsService {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async createBag(
    bagData: CreateBagRequest
  ): Promise<BagsServiceResponse<Bag>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bags`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bagData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Erro ao criar sacola",
        };
      }

      const responseText = await response.text();
      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { id: Date.now(), message: "Sacola criada com sucesso" };
        }
      } else {
        data = { id: Date.now(), message: "Sacola criada com sucesso" };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao criar sacola:", error);
      return {
        success: false,
        message: "Erro de conexão",
      };
    }
  }

  async getBagsByBusiness(
    idBusiness: number
  ): Promise<BagsServiceResponse<Bag[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bags?idBusiness=${idBusiness}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Erro ao buscar sacolas",
        };
      }
      const data = await response.json();
      const bags = data.data as Bag[];

      return {
        success: true,
        data: bags,
      };
    } catch (error) {
      console.error("Erro ao buscar sacolas:", error);
      return {
        success: false,
        message: "Erro de conexão",
      };
    }
  }

  async updateBag(
    id: number,
    bagData: UpdateBagRequest
  ): Promise<BagsServiceResponse<Bag>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bags/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bagData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Erro ao atualizar sacola",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Erro ao atualizar sacola:", error);
      return {
        success: false,
        message: "Erro de conexão",
      };
    }
  }

  async deleteBag(id: number): Promise<BagsServiceResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/bags/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Erro ao excluir sacola",
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Erro ao excluir sacola:", error);
      return {
        success: false,
        message: "Erro de conexão",
      };
    }
  }
}

export const bagsService = new BagsService();
