// src/components/pedidos/OrderDetailModalContent.tsx
import React from "react";
import { Pedido } from "@/services/pedidosService";
import StatusBadge from "@/components/statusBadge/StatusBadge";
import { formatarMoeda } from "@/utils/formatters";

interface OrderDetailModalContentProps {
  pedido: Pedido | null;
}

const OrderDetailModalContent: React.FC<OrderDetailModalContentProps> = ({
  pedido,
}) => {
  if (!pedido) {
    return (
      <div className="py-12 text-center text-gray-500">
        <i className="bx bx-loader-alt bx-spin text-3xl text-gray-300 mb-2"></i>
        <p>Carregando detalhes do pedido...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center pb-4 border-b border-gray-100">
        <StatusBadge status={pedido.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
              Cliente
            </h3>
            <p className="text-gray-800 font-medium">{pedido.cliente}</p>
            {pedido.telefone && (
              <p className="text-gray-600 text-sm mt-1">
                <i className="bx bx-phone mr-1.5"></i>
                {pedido.telefone}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
              Produto
            </h3>
            <p className="text-gray-800">{pedido.produto}</p>
            {pedido.quantidadeSacolas && (
              <p className="text-gray-600 text-sm mt-1">
                <i className="bx bx-package mr-1.5"></i>
                {pedido.quantidadeSacolas} unidades
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
              Data do Pedido
            </h3>
            <p className="text-gray-800">
              <i className="bx bx-calendar mr-1.5"></i>
              {pedido.data}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
              Valor
            </h3>
            <p className="text-xl font-semibold text-[#037335]">
              {formatarMoeda(pedido.valor)}
            </p>
          </div>
        </div>
      </div>

      {pedido.endereco && (
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
            Endereço de Entrega
          </h3>
          <p className="text-gray-800">
            <i className="bx bx-map mr-1.5 text-gray-400"></i>
            {pedido.endereco}
          </p>
        </div>
      )}

      {pedido.observacoes && (
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-medium uppercase text-gray-500 mb-1">
            Observações
          </h3>
          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
            {pedido.observacoes}
          </p>
        </div>
      )}

      {pedido.historico && pedido.historico.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-medium uppercase text-gray-500 mb-4">
            Histórico de Status
          </h3>
          <div className="space-y-4">
            {pedido.historico?.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 h-full w-6 relative">
                  <div className="absolute h-full w-0.5 bg-gray-200 left-1/2 -translate-x-1/2 top-0"></div>
                  <div
                    className={`absolute h-3 w-3 rounded-full ${
                      index === 0 ? "bg-green-500" : "bg-gray-300"
                    } top-1.5 left-1/2 -translate-x-1/2 ring-4 ring-white`}
                  ></div>
                </div>
                <div className="ml-4 pb-5">
                  <p className="text-sm font-medium text-gray-800">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.data} às {item.hora}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailModalContent;
