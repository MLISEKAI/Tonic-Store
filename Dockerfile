FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV NPM_CONFIG_PRODUCTION=false

WORKDIR /app

# Chỉ copy những file cần để install trước
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn install --frozen-lockfile

# Sau đó mới copy toàn bộ source code
COPY . .

# Tiến hành build
RUN yarn run in-package
RUN yarn run build
RUN yarn run build:back

CMD ["yarn", "run", "prd:serve"]
