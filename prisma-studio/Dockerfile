FROM node:20-bookworm

WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./

# Install build tools
RUN apt-get update && apt-get install -y make g++ python3 build-essential openssl && rm -rf /var/lib/apt/lists/*

# Install Yarn
RUN npm install -g yarn && yarn config set registry https://registry.npmjs.org/

# Install dependencies
RUN yarn install --network-timeout 100000

# Copy source code
COPY . .

# Generate Prisma Client for correct binary target
RUN npx prisma generate --binary-target=debian-openssl-3.0.x

# Expose port (optional for Studio)
EXPOSE 5555

# Default command (Prisma Studio or your backend)
CMD ["npx", "prisma", "studio"]
