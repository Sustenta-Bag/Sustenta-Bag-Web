/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import TextInput from "../input/TextInput";
import AlertComponent from "../alertComponent/Alert";

interface LoginFormProps {
  onRegisterClick: () => void;
  onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    visible: false,
    texto: "",
    tipo: "info" as "success" | "info" | "warning" | "error",
  });

  const handleLogin = () => {
    if (!email || !password) {
      setAlert({
        visible: true,
        texto: "Preencha email e senha.",
        tipo: "warning",
      });
      return;
    }

    onLogin(email, password);
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
          />
          <TextInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <PrimaryButton onClick={handleLogin}>Login</PrimaryButton>
            <PrimaryButton onClick={onRegisterClick}>Cadastre-se</PrimaryButton>
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
