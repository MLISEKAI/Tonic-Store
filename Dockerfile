FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV NPM_CONFIG_PRODUCTION=false

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && yarn build

# Build backend
RUN cd backend && yarn build

# Start server
CMD ["yarn", "prd:serve"]
