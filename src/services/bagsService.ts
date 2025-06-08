const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export interface Bag {
  id: number;
  type: "Doce" | "Salgada" | "Mista";
  price: number;
  description: string;
  idBusiness: number;
  status: number;
  createdAt: string;
}

export interface CreateBagRequest {
  type: "Doce" | "Salgada" | "Mista";
  price: number;
  description: string;
  idBusiness: number;
  status: number;
}

export interface UpdateBagRequest {
  type: "Doce" | "Salgada" | "Mista";
  price: number;
  description: string;
  idBusiness: number;
  status: number;
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

      const data = await response.json();
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
        `${API_BASE_URL}/bags/business/${idBusiness}`,
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
      return {
        success: true,
        data,
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
