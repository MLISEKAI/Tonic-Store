FROM node:22-slim

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

EXPOSE 8085 9229

# Chạy backend dev
CMD ["yarn", "start:dev"]
