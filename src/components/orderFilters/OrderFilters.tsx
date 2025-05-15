// src/components/pedidos/OrderFilters.tsx
import React from "react";

interface OrderFiltersProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  filtroData: string;
  onFiltroDataChange: (value: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  busca,
  onBuscaChange,
  filtroData,
  onFiltroDataChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative w-full md:w-64 flex-grow lg:flex-grow-0">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="bx bx-search"></i>
          </span>
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
          />
        </div>
        <div className="relative w-full md:w-48 flex-grow lg:flex-grow-0">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="bx bx-calendar"></i>
          </span>
          <select
            className="w-full py-2 pl-10 pr-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
            value={filtroData}
            onChange={(e) => onFiltroDataChange(e.target.value)}
          >
            <option value="">Todas as datas</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mês</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <i className="bx bx-chevron-down"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
