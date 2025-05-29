"use client";
import React, { useState, useEffect } from "react";
import LoginForm from "../components/login-register/LoginForm";
import RegisterForm from "../components/login-register/RegisterForm";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AlertComponent from "@/components/alertComponent/Alert";

const AuthWrapper: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, register } = useAuth();
  const [alert, setAlert] = useState({
    visible: false,
    texto: "",
    tipo: "info" as "success" | "info" | "warning" | "error",
  });

  // Captura o parâmetro redirect da URL, se existir
  const redirectPath = searchParams.get("redirect") || "/private/homePage";

  // Se já estiver autenticado, redireciona para a página privada
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setAlert({
        visible: true,
        texto: "Login realizado com sucesso!",
        tipo: "success",
      });

      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
    } else {
      setAlert({
        visible: true,
        texto: result.message || "Email ou senha inválidos.",
        tipo: "error",
      });
    }
  };

  const handleRegister = async (newUser: {
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
  }) => {
    const result = await register(newUser);

    if (result.success) {
      setAlert({
        visible: true,
        texto: "Cadastro realizado com sucesso! Por favor, faça login.",
        tipo: "success",
      });

      setTimeout(() => {
        setIsRegistering(false);
      }, 2000);
    } else {
      setAlert({
        visible: true,
        texto: result.message || "Erro ao realizar cadastro.",
        tipo: "error",
      });
    }
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  // Se já estiver autenticado, não renderiza nada enquanto redireciona
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#FFF8E8]">
      <div
        className={clsx(
          "flex w-[200%] h-full transition-transform duration-700 ease-in-out",
          isRegistering ? "-translate-x-1/2" : "translate-x-0"
        )}
      >
        <div className="w-1/2 h-full">
          <LoginForm
            onRegisterClick={() => setIsRegistering(true)}
            onLogin={handleLogin}
          />
        </div>

        <div className="w-1/2 h-full">
          <RegisterForm
            onLoginClick={() => setIsRegistering(false)}
            onRegister={handleRegister}
          />
        </div>
      </div>

      {alert.visible && (
        <AlertComponent
          tipo={alert.tipo}
          texto={alert.texto}
          visible={alert.visible}
          timeout={3000}
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

export default AuthWrapper;
