// src/components/pedidos/OrderGrid.tsx
import React from "react";
import { Pedido } from "@/services/pedidosService";
import OrderCard from "@/components/orderCard/OrderCard";

interface OrderGridProps {
  pedidos: Pedido[];
  onVisualizarPedido: (pedido: Pedido) => void;
  onAceitarPedido: (id: string) => void;
  onRecusarPedido: (id: string) => void;
  onConcluirPedido: (id: string) => void;
  onPrepararPedido: (id: string) => void;
  onProntoPedido: (id: string) => void;
}

const OrderGrid: React.FC<OrderGridProps> = ({
  pedidos,
  onVisualizarPedido,
  onAceitarPedido,
  onRecusarPedido,
  onConcluirPedido,
  onPrepararPedido,
  onProntoPedido,
}) => {
  if (pedidos.length === 0) {
    return (
      <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <i className="bx bx-search text-gray-400 text-3xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Nenhum pedido encontrado
        </h3>
        <p className="text-gray-500">
          Não encontramos pedidos com os filtros aplicados. Tente ajustar os
          critérios de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      {pedidos.map((pedido) => (
        <OrderCard
          key={pedido.id}
          pedido={pedido}
          onVisualizar={onVisualizarPedido}
          onAceitar={onAceitarPedido}
          onRecusar={onRecusarPedido}
          onConcluir={onConcluirPedido}
          onPreparar={onPrepararPedido}
          onPronto={onProntoPedido}
        />
      ))}
    </div>
  );
};

export default OrderGrid;
