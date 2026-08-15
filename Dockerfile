# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# ---- Dependencies (full, for build tooling) ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Dependencies (production only, for the runner's Prisma CLI) ----
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# `prisma generate` only reads schema.prisma to emit client code — it never
# connects to a database — so a placeholder keeps the real DATABASE_URL
# secret out of the image's build layers/cache entirely.
ARG DATABASE_URL="postgresql://user:password@localhost:5432/db"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate
RUN npm run build

# ---- Run ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# The standalone output above only traces what server.js needs to *serve
# requests* — it does not include the Prisma CLI, prisma.config.ts, or
# prisma/migrations. But the deploy pipeline runs
# `docker exec bouathmane-app npx prisma migrate deploy` against this exact
# running container after every release, so all three must be present here.
# prod-deps (not the full `deps`) is used so devDependencies like jest/eslint
# don't bloat the runtime image — prisma/dotenv/bcryptjs are real
# `dependencies` for exactly this reason.
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
