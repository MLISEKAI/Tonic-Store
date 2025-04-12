FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV NPM_CONFIG_PRODUCTION=false

WORKDIR /app

COPY package.json yarn.lock ./
COPY . .

# Cài đặt deps
RUN yarn install

# Build toàn bộ project (frontend + backend)
RUN yarn run build
RUN yarn run build:back

# Start server
CMD ["yarn", "prd:serve"]
