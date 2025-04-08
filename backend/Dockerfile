FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get update && apt-get install -y openssl

RUN yarn install

RUN npx prisma generate

COPY . .

CMD ["yarn", "run", "dev"]