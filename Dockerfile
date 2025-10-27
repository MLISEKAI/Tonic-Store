FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV NPM_CONFIG_PRODUCTION=false

WORKDIR /app

# Copy package files
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY admin/package.json ./admin/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && yarn build

# Build backend
RUN cd backend && yarn build

# Build admin
RUN cd admin && yarn build

# Start server
CMD ["yarn", "prd:serve"]
