# Use Node.js base image
FROM node:18 AS base
WORKDIR /app

# Backend Stage
FROM base AS backend
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install
COPY backend ./
CMD ["yarn", "dev"]

# Frontend Stage
FROM base AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend ./
CMD ["yarn", "dev"]
