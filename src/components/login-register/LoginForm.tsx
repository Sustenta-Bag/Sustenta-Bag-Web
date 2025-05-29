/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import TextInput from "../input/TextInput";
import Loading from "../loading/Loading";
import AlertComponent from "../alertComponent/Alert";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    texto: "",
    tipo: "info" as "success" | "info" | "warning" | "error",
  });
  const handleLogin = async () => {
    if (!email || !password) {
      setAlert({
        visible: true,
        texto: "Por favor, preencha email e senha.",
        tipo: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setAlert({
          visible: true,
          texto: "Login realizado com sucesso! Redirecionando...",
          tipo: "success",
        });
      } else {
        setAlert({
          visible: true,
          texto: result.message || "Email ou senha incorretos. Tente novamente.",
          tipo: "error",
        });
      }    } catch {
      setAlert({
        visible: true,
        texto: "Erro de conexão. Verifique sua internet e tente novamente.",
        tipo: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-10 bg-[#FFF8E8] relative">
      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-1/2 max-w-md flex flex-col gap-3">
          <h1 className="text-4xl font-bold font-serif">Login</h1>
          <p className="text-lg">Realize seu login</p>          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />          <div className="flex gap-4 mt-4">
            <PrimaryButton onClick={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loading size="small" text="" />
                  <span>Entrando...</span>
                </div>
              ) : (
                "Login"
              )}
            </PrimaryButton>
            <PrimaryButton onClick={onRegisterClick} disabled={isLoading}>
              Cadastre-se
            </PrimaryButton>
          </div>

          <p className="text-sm text-center mt-2">
            Não possui uma conta?{" "}
            <button
              onClick={onRegisterClick}
              className="underline hover:cursor-pointer"
            >
              Inscreva-se
            </button>
          </p>
        </div>
      </div>

      <div className="w-1/2 ">
        <img
          src="/star.png"
          alt="Loja ilustrativa"
          className="absolute top-0 -right-1/4 h-screen"
        />
        <img
          src="/store.svg"
          alt="Loja ilustrativa"
          className="absolute top-0 -right-1/4 h-screen"
        />
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

export default LoginForm;
