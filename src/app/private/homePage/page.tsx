"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFF8E8] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Painel do Estabelecimento</h1>
            <button
              onClick={logout}
              className="bg-[#E05D5D] text-white px-4 py-2 rounded-md hover:bg-[#c54c4c] transition-colors"
            >
              Desconectar
            </button>
          </div>

          {user ? (
            <div className="mb-6 border-b pb-4">
              <h2 className="font-semibold text-xl mb-4">
                Informações da Conta
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-3 text-lg">
                    Dados Principais
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Nome fantasia:</span>{" "}
                      {user.nomeFantasia}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">CNPJ:</span> {user.cnpj}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-3 text-lg">Endereço</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Cidade:</span>{" "}
                      {user.cidade || "Não informado"}
                    </p>
                    <p>
                      <span className="font-medium">Bairro:</span>{" "}
                      {user.bairro || "Não informado"}
                    </p>
                    <p>
                      <span className="font-medium">Rua:</span>{" "}
                      {user.rua || "Não informada"}
                    </p>
                    <p>
                      <span className="font-medium">Número:</span>{" "}
                      {user.numero || "Não informado"}
                    </p>
                    <p>
                      <span className="font-medium">CEP:</span>{" "}
                      {user.cep || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Carregando informações do usuário...</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Estatísticas</h3>
              <p>Aqui serão exibidas estatísticas de uso.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Pedidos Recentes</h3>
              <p>Aqui serão exibidos seus pedidos recentes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
