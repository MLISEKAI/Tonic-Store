FROM node:22-slim

WORKDIR /app

# Copy package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt các dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

# Chạy frontend
CMD ["yarn", "dev"]
