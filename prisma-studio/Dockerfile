FROM sitespeedio/node:ubuntu-22-04-nodejs-20.17.0.1

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development

# Cài đặt các dependencies cần thiết
RUN apt-get update && apt-get install -y make g++ python3 build-essential openssl

# Cài yarn và các packages
RUN npm install -g yarn
RUN yarn install

# Sao chép source code
COPY . .


# Chạy prisma studio
CMD ["npx", "prisma", "studio"] 