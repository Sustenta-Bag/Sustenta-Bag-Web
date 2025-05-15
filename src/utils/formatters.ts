// src/utils/formatters.ts
export const converterDataParaDate = (dataString: string): Date => {
  const partes = dataString.split("/");
  return new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
};

export const formatarDataParaComparacao = (data: Date): string => {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(data.getDate()).padStart(2, "0")}`;
};

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};
