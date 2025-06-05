FROM node:20-alpine

# Instala dependências necessárias
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalação de dependências
COPY package.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Expõe a porta para acesso à aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]