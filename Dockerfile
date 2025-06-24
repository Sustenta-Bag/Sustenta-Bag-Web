# Dockerfile para desenvolvimento
FROM node:20-alpine

# Instala dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia arquivos de configuração
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm ci --frozen-lockfile

# Copia o código fonte
COPY . .

# Configura variáveis de ambiente
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Cria usuário para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 4079

ENV PORT=4079
ENV HOSTNAME="0.0.0.0"

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]