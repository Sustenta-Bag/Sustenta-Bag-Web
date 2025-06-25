// src/components/pedidos/StatusBadge.tsx
import React from "react";
import { Pedido } from "@/services/pedidosService"; // Assumindo que Pedido tem o tipo de status

interface StatusBadgeProps {
  status: Pedido["status"];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "pendente":
      return (
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
          Pendente
        </span>
      );
    case "confirmado":
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
          Confirmado
        </span>
      );
    case "pronto": 
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></span>
          Pronto
        </span>
      );
    case "preparando":
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
          Preparando
        </span>
      );
    case "entregue":
      return (
        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-teal-500 mr-1.5"></span>
          Entregue
        </span>
      );
    case "pago":
      return (
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
          Pago
        </span>
      );
    case "cancelado":
      return (
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
          Cancelado
        </span>
      );
    default:
      return null;
  }
};

export default StatusBadge;
