FROM node:22-alpine AS production

# Thêm build tools (typescript, node-gyp)
RUN apk add --no-cache python3 make g++ bash git

ENV NODE_ENV=production
ENV NPM_CONFIG_PRODUCTION=false

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/yarn.lock ./frontend/
COPY backend/package.json backend/yarn.lock ./backend/
COPY admin/package.json admin/yarn.lock ./admin/

# Cài dependencies
RUN yarn global add typescript
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && yarn build

# Build backend
RUN cd backend && yarn build

# Build admin
RUN cd admin && yarn build

# Chạy backend (server chính)
WORKDIR /app/backend
# Start server
CMD ["yarn", "prd:serve"]

