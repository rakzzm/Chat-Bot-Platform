FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY patches ./patches
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/patches ./patches
COPY . .
RUN npm run build

FROM base AS development
WORKDIR /app
COPY package*.json ./
COPY patches ./patches
RUN npm install
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM base AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/extensions ./src/extensions
COPY --from=builder /app/patches ./patches
COPY package*.json ./
RUN npm install --only=production
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
