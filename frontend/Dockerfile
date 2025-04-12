FROM node:20-slim

WORKDIR /app

# Copy package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt các dependencies
RUN yarn install --frozen-lockfile

# Sao chép file .env vào container
COPY .env .env

COPY . .

EXPOSE 5173

# Chạy frontend
CMD ["yarn", "dev"]
