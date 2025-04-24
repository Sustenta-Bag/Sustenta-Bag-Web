/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import TextInput from "../input/TextInput";
import { useAuth } from "@/context/AuthContext";
import AlertComponent from "../alertComponent/Alert";

type RegisterFormProps = {
  onLoginClick: () => void;
  onRegister: (newUser: {
    nomeFantasia: string;
    email: string;
    cnpj: string;
    senha: string;
  }) => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nomeFantasia: "",
    cidade: "",
    cnpj: "",
    bairro: "",
    email: "",
    rua: "",
    senha: "",
    numero: "",
    confirmarSenha: "",
    cep: "",
  });
  const [alert, setAlert] = useState({
    visible: false,
    texto: "",
    tipo: "info" as "success" | "info" | "warning" | "error",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validar campos obrigatórios
    if (
      !formData.nomeFantasia ||
      !formData.email ||
      !formData.cnpj ||
      !formData.senha
    ) {
      setAlert({
        visible: true,
        texto: "Por favor, preencha todos os campos obrigatórios.",
        tipo: "error",
      });
      return;
    }

    // Validar se as senhas conferem
    if (formData.senha !== formData.confirmarSenha) {
      setAlert({
        visible: true,
        texto: "As senhas não conferem.",
        tipo: "error",
      });
      return;
    }

    try {
      const success = await register({
        nomeFantasia: formData.nomeFantasia,
        email: formData.email,
        cnpj: formData.cnpj,
        senha: formData.senha,
        cidade: formData.cidade,
        bairro: formData.bairro,
        rua: formData.rua,
        numero: formData.numero,
        cep: formData.cep,
      });

      if (success) {
        // Cadastro realizado com sucesso
        setAlert({
          visible: true,
          texto: "Cadastro realizado com sucesso!",
          tipo: "success",
        });

        // Chamar a função de callback após 2 segundos
        setTimeout(() => {
          onLoginClick();
        }, 2000);
      } else {
        // CNPJ já existe
        setAlert({
          visible: true,
          texto: "CNPJ já cadastrado. Por favor, utilize outro CNPJ.",
          tipo: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setAlert({
        visible: true,
        texto: "Ocorreu um erro ao realizar o cadastro.",
        tipo: "error",
      });
    }
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-10 bg-[#FFF8E8] relative">
      <div className="w-1/2">
        <img
          src="/star.png"
          alt="Loja ilustrativa"
          className="absolute top-0 -left-1/4 h-screen"
        />
        <img
          src="/store.svg"
          alt="Loja ilustrativa"
          className="absolute top-0 -left-1/4 h-screen"
        />
      </div>

      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-1/2 max-w-3xl flex flex-col gap-6">
          <h1 className="text-4xl font-bold font-serif mb-6">Cadastro</h1>

          <form className="flex gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              <TextInput
                label="Nome fantasia"
                value={formData.nomeFantasia}
                onChange={(e) => handleChange("nomeFantasia", e.target.value)}
              />
              <TextInput
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => handleChange("cnpj", e.target.value)}
              />
              <TextInput
                label="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <TextInput
                type="password"
                label="Senha"
                value={formData.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
              />
              <TextInput
                type="password"
                label="Confirmar senha"
                value={formData.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
              />
            </div>

            <div className="w-1/2 flex flex-col gap-2">
              <TextInput
                label="Cidade"
                value={formData.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
              />
              <TextInput
                label="Bairro"
                value={formData.bairro}
                onChange={(e) => handleChange("bairro", e.target.value)}
              />
              <TextInput
                label="Rua"
                value={formData.rua}
                onChange={(e) => handleChange("rua", e.target.value)}
              />
              <TextInput
                label="Número"
                value={formData.numero}
                onChange={(e) => handleChange("numero", e.target.value)}
              />
              <TextInput
                label="CEP"
                value={formData.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
              />
            </div>
          </form>

          <div className="flex gap-4 mt-6">
            <PrimaryButton onClick={onLoginClick}>Voltar</PrimaryButton>
            <PrimaryButton onClick={handleSave}>Salvar</PrimaryButton>
          </div>
        </div>
      </div>

      {alert.visible && (
        <AlertComponent
          tipo={alert.tipo}
          texto={alert.texto}
          visible={alert.visible}
          timeout={5000}
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

export default RegisterForm;
