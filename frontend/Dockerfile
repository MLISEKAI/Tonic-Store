FROM sitespeedio/node:ubuntu-22-04-nodejs-20.17.0.1 AS base

FROM base AS dev
WORKDIR /app

COPY package*.json ./



ENV NODE_ENV=development
RUN apt-get update && apt-get install -y openssl
RUN npm install -g yarn

RUN yarn

COPY . .

CMD ["yarn", "run", "dev "]