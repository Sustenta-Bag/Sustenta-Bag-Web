import { ReactNode } from "react";

interface CardProps {
  titulo: string;
  valor: number;
  descricao: string;
  corBorda: string;
  corIconeBg: string;
  icone: ReactNode;
}

export const Card = ({
  titulo,
  valor,
  descricao,
  corBorda,
  corIconeBg,
  icone,
}: CardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${corBorda}`}>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{titulo}</span>
        <span
          className={`w-8 h-8 text-xl rounded-full p-1 flex items-center justify-center ${corIconeBg}`}
        >
          {icone}
        </span>
      </div>
      <p className="text-2xl font-bold mt-2">{valor}</p>
      <p className="text-xs text-gray-500 mt-1">{descricao}</p>
    </div>
  );
};
