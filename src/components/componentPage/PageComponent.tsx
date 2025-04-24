"use client";

import React, { useState } from "react";
import AlertComponent from "@/components/alertComponent/Alert";
import ModalComponent from "@/components/Modal/ModalComponent";

const PageComponent = () => {
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [showAlert, setShowAlert] = useState(false);
  const [timeoutDuration, setTimeoutDuration] = useState(3000); // 3 segundos por padrão

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Página de Componentes</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl w-full">
        <h2 className="text-xl font-semibold">Exemplo de Alerta</h2>
        <input
          type="text"
          placeholder="Digite o texto do alerta"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={alertText}
          onChange={(e) => setAlertText(e.target.value)}
        />
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={alertType}
          onChange={(e) =>
            setAlertType(
              e.target.value as "success" | "info" | "warning" | "error"
            )
          }
        >
          <option value="success">Sucesso</option>
          <option value="info">Informação</option>
          <option value="warning">Aviso</option>
          <option value="error">Erro</option>
        </select>

        <div className="flex gap-4 items-center">
          <input
            type="number"
            placeholder="Tempo em ms (ex: 3000)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={timeoutDuration}
            onChange={(e) => setTimeoutDuration(Number(e.target.value))}
            min="100"
            step="100"
          />
          <button
            onClick={handleShowAlert}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded transition-colors"
          >
            Mostrar Alerta
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl w-full">
        <h2 className="text-xl font-semibold">Exemplo de Modal</h2>
        <ModalComponent
          textButton="Abrir Modal"
          titleModal="Título do Modal"
          textModal="Esse é o conteúdo do modal."
        />
      </div>

      {/* Alerta sempre renderizado na tela, com visibilidade controlada pelo estado */}
      <AlertComponent
        tipo={alertType}
        texto={alertText || "Mensagem padrão"}
        visible={showAlert}
        timeout={timeoutDuration}
        onClose={handleCloseAlert}
      />
    </div>
  );
};

export default PageComponent;
