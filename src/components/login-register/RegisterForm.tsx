/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import TextInput from "../input/TextInput";
import SelectInput from "../input/SelectInput";
import Loading from "../loading/Loading";
import { useAuth } from "@/context/AuthContext";
import AlertComponent from "../alertComponent/Alert";
import { formatarCNPJ, removerMascaraCNPJ } from "@/utils/formatters";

type RegisterFormProps = {
  onLoginClick: () => void;
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const { register } = useAuth();
  const estados = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

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

  const [isLoading, setIsLoading] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    texto: "",
    tipo: "info" as "success" | "info" | "warning" | "error",
  });
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = formatarCNPJ(e.target.value);
    setFormData((prev) => ({ ...prev, cnpj: maskedValue }));
  };

  const handleSelectChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
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

    // Validação do CNPJ (deve ter 14 dígitos)
    const cnpjDigits = removerMascaraCNPJ(formData.cnpj);
    if (cnpjDigits.length !== 14) {
      setAlert({
        visible: true,
        texto: "CNPJ deve conter 14 dígitos.",
        tipo: "error",
      });
      return;
    }

    // Validação de confirmação de senha
    if (formData.password !== formData.confirmarSenha) {
      setAlert({
        visible: true,
        texto: "As senhas não conferem.",
        tipo: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        legalName: formData.legalName,
        cnpj: cnpjDigits,
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
          texto:
            "Cadastro realizado com sucesso! Redirecionando para o login...",
          tipo: "success",
        });

        setTimeout(() => {
          onLoginClick();
        }, 2000);
      } else {
        setAlert({
          visible: true,
          texto:
            result.message || "Erro ao realizar cadastro. Tente novamente.",
          tipo: "error",
        });
      }
    } catch {
      setAlert({
        visible: true,
        texto:
          "Ocorreu um erro de conexão. Verifique sua internet e tente novamente.",
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
                label="Nome da Empresa"
                value={formData.legalName}
                onChange={(e) => handleChange("legalName", e.target.value)}
                required
              />
              <TextInput
                label="Nome do App"
                value={formData.appName}
                onChange={(e) => handleChange("appName", e.target.value)}
                required
              />
              <TextInput
                label="CNPJ"
                value={formData.cnpj}
                onChange={handleCNPJChange}
                maxLength={18}
                required
              />
              <TextInput
                label="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
              <TextInput
                label="Celular"
                value={formData.cellphone}
                onChange={(e) => handleChange("cellphone", e.target.value)}
                maxLength={11}
                required
              />
              <TextInput
                type="password"
                label="Senha"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
              <TextInput
                type="password"
                label="Confirmar senha"
                value={formData.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                required
              />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <TextInput
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
              <TextInput
                label="CEP"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                required
              />
              <SelectInput
                label="Estado"
                value={formData.state}
                onChange={handleSelectChange("state")}
                options={estados}
                required
              />
              <TextInput
                label="Cidade"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required
              />
              <TextInput
                label="Rua"
                value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
                required
              />
              <TextInput
                label="Número"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
                required
              />
              <TextInput
                label="Complemento"
                value={formData.complement}
                onChange={(e) => handleChange("complement", e.target.value)}
              />
            </div>
          </form>
          <div className="flex gap-4 mt-6">
            <PrimaryButton onClick={onLoginClick} disabled={isLoading}>
              Voltar
            </PrimaryButton>
            <PrimaryButton onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loading size="small" text="" />
                  <span>Salvando...</span>
                </div>
              ) : (
                "Salvar"
              )}
            </PrimaryButton>
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
