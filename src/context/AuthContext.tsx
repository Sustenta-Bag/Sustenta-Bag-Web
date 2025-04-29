/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  nomeFantasia: string;
  email: string;
  cnpj: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  cep?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cnpj: string, senha: string) => Promise<boolean>;
  logout: () => void;
  register: (newUser: {
    nomeFantasia: string;
    email: string;
    cnpj: string;
    senha: string;
    cidade?: string;
    bairro?: string;
    rua?: string;
    numero?: string;
    cep?: string;
  }) => Promise<boolean>;
}

// Usuários simulados (em produção seria do backend)
const initialUsers = [
  {
    nomeFantasia: "Padaria Central",
    email: "contato@padariacentral.com",
    cnpj: "1234567890001",
    senha: "1234",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário já está autenticado quando o componente é montado
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Recuperar lista de usuários do localStorage se existir
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error("Erro ao recuperar usuário:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (cnpj: string, senha: string): Promise<boolean> => {
    // Simula uma chamada de API
    const foundUser = users.find((u) => u.cnpj === cnpj && u.senha === senha);

    if (foundUser) {
      // Remove a senha antes de armazenar
      const { senha: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (newUser: {
    nomeFantasia: string;
    email: string;
    cnpj: string;
    senha: string;
    cidade?: string;
    bairro?: string;
    rua?: string;
    numero?: string;
    cep?: string;
  }): Promise<boolean> => {
    // Verificar se já existe um usuário com o mesmo CNPJ
    if (users.some((user) => user.cnpj === newUser.cnpj)) {
      return false; // CNPJ já cadastrado
    }

    // Adicionar o novo usuário ao array
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Salvar no localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
