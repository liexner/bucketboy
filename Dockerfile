FROM node:26-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:26-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

ARG VERSION
ENV NODE_ENV=production
ENV PUBLIC_VERSION=$VERSION
EXPOSE 3000
CMD ["node", "build"]
