FROM node:18-alpine AS base

FROM base AS dev
WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development
RUN apk add --no-cache python3 make g++

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["yarn", "run", "dev"]