import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Docker em produção
  output: 'standalone',
  
  // Configurações de otimização
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // Configurações de imagem (se necessário)
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
