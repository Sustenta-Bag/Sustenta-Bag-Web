export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  entityType: string;
  userData: {
    email: string;
    password: string;
  };
  entityData: {
    legalName: string;
    cnpj: string;
    appName: string;
    cellphone: string;
    description: string;
    delivery: boolean;
    deliveryTax: number;
    idAddress: {
      zipCode: string;
      state: string;
      city: string;
      street: string;
      number: string;
      complement: string;
    };
    status: number;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  entity?: any;
  token?: string;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          user: result.user,
          entity: result.entity,
          token: result.token,
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Erro no login",
        };
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return {
        success: false,
        message: "Erro de conexão com o servidor",
      };
    }
  },
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          user: result.user,
          entity: result.entity,
          token: result.token,
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Erro no registro",
        };
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return {
        success: false,
        message: "Erro de conexão com o servidor",
      };
    }
  },
};
