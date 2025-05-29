"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, RegisterRequest } from "../services/authService";

interface User {
  id?: number;
  email: string;
  legalName?: string;
  cnpj?: string;
  appName?: string;
  cellphone?: string;
  description?: string;
  delivery?: boolean;
  deliveryTax?: number;
  address?: {
    zipCode: string;
    state: string;
    city: string;
    street: string;
    number: string;
    complement: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (newUser: {
    email: string;
    password: string;
    legalName: string;
    cnpj: string;
    appName: string;
    cellphone: string;
    description: string;
    delivery: boolean;
    deliveryTax: number;
    zipCode: string;
    state: string;
    city: string;
    street: string;
    number: string;
    complement: string;
  }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao recuperar usuário:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch {
      return { success: false, message: "Erro de conexão" };
    }
  };

  const register = async (newUser: {
    email: string;
    password: string;
    legalName: string;
    cnpj: string;
    appName: string;
    cellphone: string;
    description: string;
    delivery: boolean;
    deliveryTax: number;
    zipCode: string;
    state: string;
    city: string;
    street: string;
    number: string;
    complement: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const registerData: RegisterRequest = {
        entityType: "business",
        userData: {
          email: newUser.email,
          password: newUser.password,
        },
        entityData: {
          legalName: newUser.legalName,
          cnpj: newUser.cnpj,
          appName: newUser.appName,
          cellphone: newUser.cellphone,
          description: newUser.description,
          delivery: newUser.delivery,
          deliveryTax: newUser.deliveryTax,
          idAddress: {
            zipCode: newUser.zipCode,
            state: newUser.state,
            city: newUser.city,
            street: newUser.street,
            number: newUser.number,
            complement: newUser.complement,
          },
          status: 1,
        },
      };

      const response = await authService.register(registerData);
        if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch {
      return { success: false, message: "Erro de conexão" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
