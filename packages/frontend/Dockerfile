FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/widget/package*.json ./packages/widget/

RUN npm install

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY ./packages/widget ./packages/widget
COPY ./packages/frontend ./packages/frontend
COPY --from=deps /app/packages/widget/node_modules ./packages/widget/node_modules
COPY --from=deps /app/packages/frontend/node_modules ./packages/frontend/node_modules

WORKDIR /app/packages/frontend
RUN \
    if [ -f ../../yarn.lock ]; then yarn run build; \
    elif [ -f ../../package-lock.json ]; then npm run build; \
    elif [ -f ../../pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM base AS development

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

COPY packages/frontend/package*.json ./packages/frontend/

COPY packages/widget/package*.json ./packages/widget/

RUN npm install

COPY ./packages/frontend ./packages/frontend
COPY ./packages/widget ./packages/widget

ENV NEXT_IGNORE_INCORRECT_LOCKFILE=true
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

WORKDIR /app/packages/frontend

CMD ["npm", "run", "dev", "--", "-p", "8080"]

FROM base AS production
WORKDIR /app

ENV NEXT_IGNORE_INCORRECT_LOCKFILE=true
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend/.next/standalone/frontend ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend/.next/static ./.next/static

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/frontend/public ./public

RUN chown nextjs:nodejs .next

USER nextjs

EXPOSE 8080

ENV PORT 8080

CMD HOSTNAME="0.0.0.0" node server.js
