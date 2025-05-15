// src/components/pedidos/OrderCard.tsx
import React from "react";
import { Pedido } from "@/services/pedidosService";
import StatusBadge from "@/components/statusBadge/StatusBadge";
import { formatarMoeda } from "@/utils/formatters";

interface OrderCardProps {
  pedido: Pedido;
  onVisualizar: (pedido: Pedido) => void;
  onAceitar: (id: string) => void;
  onRecusar: (id: string) => void;
  onConcluir: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  pedido,
  onVisualizar,
  onAceitar,
  onRecusar,
  onConcluir,
}) => {
  const renderizarAcoes = () => {
    switch (pedido.status) {
      case "pendente":
        return (
          <div className="flex space-x-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAceitar(pedido.id);
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
            >
              <i className="bx bx-check mr-1"></i> Aceitar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRecusar(pedido.id);
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
            >
              <i className="bx bx-x mr-1"></i> Recusar
            </button>
          </div>
        );
      case "aceito":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConcluir(pedido.id);
            }}
            className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
          >
            <i className="bx bx-package mr-1"></i> Concluir
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onVisualizar(pedido)}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">{pedido.id}</h3>
          <StatusBadge status={pedido.status} />
        </div>
        <p className="text-sm text-gray-600 mb-1 truncate">
          <i className="bx bx-user text-gray-400 mr-1.5"></i>
          {pedido.cliente}
        </p>
        <p className="text-sm text-gray-600 mb-1 truncate">
          <i className="bx bx-shopping-bag text-gray-400 mr-1.5"></i>
          {pedido.produto}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <i className="bx bx-calendar text-gray-400 mr-1.5"></i>
          {pedido.data}
        </p>
        <p className="text-sm font-medium text-[#037335]">
          <i className="bx bx-money text-gray-400 mr-1.5"></i>
          {formatarMoeda(pedido.valor)}
        </p>
      </div>
      <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
        {renderizarAcoes()}
      </div>
    </div>
  );
};

export default OrderCard;
