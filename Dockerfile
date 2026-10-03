FROM node:22-slim

WORKDIR /app

# Install native build tools for dependencies
RUN apt-get update && apt-get install -y python3 make g++ curl && rm -rf /var/lib/apt/lists/*

# Copy package configurations
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY web/package*.json ./web/

# Install node dependencies
RUN npm install
RUN cd backend && npm install
RUN cd web && npm install

# Copy application code
COPY . .

# Build frontend and backend
RUN npm run build

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "backend/dist/backend/src/server.js"]
