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

  const handleLogin = async (cnpj: string, senha: string) => {
    const success = await login(cnpj, senha);
    if (success) {
      // Login bem-sucedido
      setAlert({
        visible: true,
        texto: "Login realizado com sucesso!",
        tipo: "success",
      });

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
    } else {
      setAlert({
        visible: true,
        texto: "CNPJ ou senha inválidos.",
        tipo: "error",
      });
    }
  };

  const handleRegister = async (newUser: {
    nomeFantasia: string;
    email: string;
    cnpj: string;
    senha: string;
  }) => {
    const success = await register({
      ...newUser,
    });

    if (success) {
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
        texto: "Erro ao realizar cadastro. CNPJ já cadastrado.",
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
