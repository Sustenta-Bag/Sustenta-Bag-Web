"use client";
import React, { useState, useEffect } from "react";
import LoginForm from "../components/login-register/LoginForm";
import RegisterForm from "../components/login-register/RegisterForm";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AuthWrapper: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Captura o parâmetro redirect da URL, se existir
  const redirectPath = searchParams.get("redirect") || "/private/homePage";

  // Se já estiver autenticado, redireciona para a página privada
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }  }, [isAuthenticated, redirectPath, router]);

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
          <LoginForm onRegisterClick={() => setIsRegistering(true)} />
        </div>

        <div className="w-1/2 h-full">
          <RegisterForm onLoginClick={() => setIsRegistering(false)} />
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
