FROM node:22-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN npx prisma generate
RUN yarn build

FROM node:22-slim AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=8085
ENV HOST=0.0.0.0
ENV LOG_DIR=/tmp/logs

EXPOSE 8085

USER nobody

CMD ["node", "dist/index.js"]
