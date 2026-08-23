FROM node:22-slim

WORKDIR /app

COPY package.json yarn.lock ./


RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN yarn install 

COPY . .

EXPOSE 3001

CMD ["yarn", "dev"]
