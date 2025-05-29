// src/components/pedidos/StatisticsCards.tsx
import React from "react";
import { Card } from "@/components/card/Card";
import { formatarMoeda } from "@/utils/formatters";
import { MdPendingActions } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { CiViewList } from "react-icons/ci";

interface StatisticsProps {
  total: number;
  pendentes: number;
  aceitos: number;
  concluidos: number;
  valorTotal: number;
}

interface StatisticsCardsProps {
  estatisticas: StatisticsProps;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ estatisticas }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card
        titulo="Total de Pedidos"
        valor={estatisticas.total}
        descricao={`Valor total: ${formatarMoeda(estatisticas.valorTotal)}`}
        corBorda="border-[#037335]"
        corIconeBg="bg-green-100"
        icone={<CiViewList className="text-zinc-800 text-2xl" />}
      />
      <Card
        titulo="Pendentes"
        valor={estatisticas.pendentes}
        descricao="Aguardando aprovação"
        corBorda="border-amber-500"
        corIconeBg="bg-amber-100"
        icone={<MdPendingActions className="text-zinc-800 text-2xl" />}
      />
      <Card
        titulo="Em Processo"
        valor={estatisticas.aceitos}
        descricao="Em preparação"
        corBorda="border-blue-500"
        corIconeBg="bg-blue-100"
        icone={<BiLoaderCircle className="text-zinc-800 text-2xl" />}
      />
      <Card
        titulo="Concluídos"
        valor={estatisticas.concluidos}
        descricao="Entregues ao cliente"
        corBorda="border-green-500"
        corIconeBg="bg-green-100"
        icone={<AiOutlineCheckCircle className="text-zinc-800 text-2xl" />}
      />
    </div>
  );
};

export default StatisticsCards;
