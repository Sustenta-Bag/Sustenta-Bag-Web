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

export const formatarCNPJ = (cnpj: string): string => {
  const apenasDigitos = cnpj.replace(/\D/g, "").substring(0, 14);
  
  if (apenasDigitos.length <= 2) {
    return apenasDigitos;
  } else if (apenasDigitos.length <= 5) {
    return apenasDigitos.replace(/(\d{2})(\d+)/, "$1.$2");
  } else if (apenasDigitos.length <= 8) {
    return apenasDigitos.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
  } else if (apenasDigitos.length <= 12) {
    return apenasDigitos.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
  } else {
    return apenasDigitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, "$1.$2.$3/$4-$5");
  }
};

export const removerMascaraCNPJ = (cnpj: string): string => {
  return cnpj.replace(/\D/g, "");
};
