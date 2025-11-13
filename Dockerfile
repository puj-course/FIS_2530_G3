# Etapa 1: build (compilar TypeScript)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos definición de dependencias y tsconfig
COPY package*.json tsconfig*.json ./

# Instalamos TODAS las dependencias (incluye dev para compilar y testear si quieres)
RUN npm ci

# Copiamos el código fuente del backend
COPY src ./src

# Compilamos TypeScript a JavaScript (dist/)
RUN npm run build

# ----------------------------------------------------
# Etapa 2: runtime (imagen final, más liviana)
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Solo necesitamos package.json para prod
COPY package*.json ./

# Instalamos SOLO dependencias de producción
RUN npm ci --omit=dev

# Copiamos el código compilado desde la etapa builder
COPY --from=builder /app/dist ./dist

# Exponemos el puerto del backend
EXPOSE 3000

# Comando para arrancar la API
CMD ["node", "dist/server.js"]
