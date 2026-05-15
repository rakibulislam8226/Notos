# --- Stage 1: Build ---
FROM node:22-alpine AS build

WORKDIR /app

# Copy manifests first so npm ci layer is cached unless deps change
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci

# Copy source
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

# DATABASE_URL is read from a BuildKit secret — never stored in any image layer.
# Falls back to a dummy so Prisma can parse the schema; no real connection is made at build time.
RUN --mount=type=secret,id=database_url \
    export DATABASE_URL=$(cat /run/secrets/database_url 2>/dev/null || echo 'postgresql://build:build@localhost/build') && \
    npx prisma generate && \
    npm run build && \
    test -f dist/main.js

# --- Stage 2: Production ---
FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001 -G nestjs

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Strip dev dependencies; @prisma/client stays (it's a production dependency)
RUN npm prune --omit=dev && \
    mkdir -p media && chown -R nestjs:nestjs /app

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]
