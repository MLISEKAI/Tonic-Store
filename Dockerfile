FROM sitespeedio/node:ubuntu-22-04-nodejs-20.17.0.1 AS base

FROM base AS dev
WORKDIR /app

ENV NODE_ENV=development
RUN apt-get update && apt-get install -y openssl
RUN npm install -g yarn

FROM node:22-alpine AS production
ENV NPM_CONFIG_PRODUCTION=false

WORKDIR /app
COPY . .

ENV NODE_ENV=production
RUN apt-get update && apt-get install -y openssl
RUN yarn run in-package
RUN yarn run build
RUN yarn run build:back

CMD ["yarn", "run", "prd:serve"]