# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto
COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

# Instala las dependencias
RUN npm install

# Compila el código TypeScript
RUN npm run build

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]