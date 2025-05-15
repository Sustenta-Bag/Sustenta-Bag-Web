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
    case "aceito":
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
          Aceito
        </span>
      );
    case "concluido":
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
          Concluído
        </span>
      );
    case "recusado":
      return (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
          Recusado
        </span>
      );
    default:
      return null;
  }
};

export default StatusBadge;
