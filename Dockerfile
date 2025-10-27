FROM node:22-alpine AS production

# Thêm build tools (typescript, node-gyp)
RUN apk add --no-cache python3 make g++ bash git

ENV NODE_ENV=development
ENV NPM_CONFIG_PRODUCTION=false

WORKDIR /app

# Copy package files trước để tận dụng cache
COPY frontend/package.json frontend/yarn.lock ./frontend/
COPY backend/package.json backend/yarn.lock ./backend/
COPY admin/package.json admin/yarn.lock ./admin/

# Install dependencies cho frontend (bao gồm devDependencies)
WORKDIR /app/frontend
RUN yarn install --frozen-lockfile

WORKDIR /app
# Copy source code
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN yarn build

# Install dependencies và build backend
WORKDIR /app/backend
RUN yarn install --frozen-lockfile
RUN yarn build

# Install dependencies và build admin
WORKDIR /app/admin
RUN yarn install --frozen-lockfile
RUN yarn build

# Chạy backend (server chính)
WORKDIR /app/backend
# Start server
CMD ["yarn", "prd:serve"]

