FROM node:20-slim

WORKDIR /app

# Copy package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt các dependencies
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

# Chạy frontend
CMD ["yarn", "dev"]


# FROM node:20-slim AS build

# WORKDIR /app

# # Copy package.json và yarn.lock
# COPY package.json yarn.lock ./

# # Cài dependencies
# RUN yarn install --frozen-lockfile

# # Copy toàn bộ source code
# COPY . .

# # Build production (sẽ tạo thư mục dist/)
# RUN yarn build


# Serve bằng Nginx ---
# FROM nginx:stable-alpine

# # Copy file build từ giai đoạn trước vào Nginx
# COPY --from=build /app/dist /usr/share/nginx/html

# Copy file nginx.conf 
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
