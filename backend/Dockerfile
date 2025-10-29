FROM node:20-slim

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN apt-get update && apt-get install -y openssl

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN yarn build

EXPOSE 8085 9229

# Chạy backend dev
CMD ["yarn", "start:dev"]

# Chạy backend prod (sau khi build)
# CMD ["node", "dist/index.js"]