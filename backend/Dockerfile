FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get update && apt-get install -y openssl

RUN yarn install

RUN npx prisma generate

COPY . .

# Start server (debug mode)
CMD ["node", "--inspect=0.0.0.0:9229", "-r", "ts-node/register", "src/index.ts"]