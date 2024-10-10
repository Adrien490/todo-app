FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Générer le client Prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Exposer le port
EXPOSE 3000

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
