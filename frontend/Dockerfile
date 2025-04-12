FROM node:20-slim

WORKDIR /app

# Copy package.json và yarn.lock
COPY package*.json ./

# Cài đặt các dependencies
RUN yarn install

# Sao chép file .env vào container
COPY .env .env

COPY . .

# Chạy frontend
CMD ["yarn", "run", "dev"]
