/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import TextInput from "../input/TextInput";
import { useAuth } from "@/context/AuthContext";
import AlertComponent from "../alertComponent/Alert";

type RegisterFormProps = {
  onLoginClick: () => void;
  onRegister: (newUser: {
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
  }) => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    legalName: "",
    cnpj: "",
    appName: "",
    cellphone: "",
    description: "",
    delivery: true,
    deliveryTax: 5.99,
    zipCode: "",
    state: "",
    city: "",
    street: "",
    number: "",
    complement: "",
    confirmarSenha: "",
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
    if (
      !formData.legalName ||
      !formData.email ||
      !formData.cnpj ||
      !formData.password ||
      !formData.appName ||
      !formData.cellphone ||
      !formData.description ||
      !formData.zipCode ||
      !formData.state ||
      !formData.city ||
      !formData.street ||
      !formData.number
    ) {
      setAlert({
        visible: true,
        texto: "Por favor, preencha todos os campos obrigatórios.",
        tipo: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmarSenha) {
      setAlert({
        visible: true,
        texto: "As senhas não conferem.",
        tipo: "error",
      });
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        legalName: formData.legalName,
        cnpj: formData.cnpj,
        appName: formData.appName,
        cellphone: formData.cellphone,
        description: formData.description,
        delivery: formData.delivery,
        deliveryTax: formData.deliveryTax,
        zipCode: formData.zipCode,
        state: formData.state,
        city: formData.city,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
      });

      if (result.success) {
        setAlert({
          visible: true,
          texto: "Cadastro realizado com sucesso!",
          tipo: "success",
        });

        setTimeout(() => {
          onLoginClick();
        }, 2000);
      } else {
        setAlert({
          visible: true,
          texto: result.message || "Erro ao realizar cadastro.",
          tipo: "error",
        });
      }
    } catch {
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
          <h1 className="text-4xl font-bold font-serif mb-6">Cadastro</h1>          <form className="flex gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              <TextInput
                label="Nome da Empresa"
                value={formData.legalName}
                onChange={(e) => handleChange("legalName", e.target.value)}
              />
              <TextInput
                label="Nome do App"
                value={formData.appName}
                onChange={(e) => handleChange("appName", e.target.value)}
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
                label="Celular"
                value={formData.cellphone}
                onChange={(e) => handleChange("cellphone", e.target.value)}
              />
              <TextInput
                type="password"
                label="Senha"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
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
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <TextInput
                label="CEP"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
              />
              <TextInput
                label="Estado"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
              <TextInput
                label="Cidade"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              <TextInput
                label="Rua"
                value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
              />
              <TextInput
                label="Número"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
              />
              <TextInput
                label="Complemento"
                value={formData.complement}
                onChange={(e) => handleChange("complement", e.target.value)}
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
