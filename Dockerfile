# check=skip=SecretsUsedInArgOrEnv

FROM oven/bun:1 AS base

# ---------------------------------------------------------------------------- #
#                                 Dependencies                                 #
# ---------------------------------------------------------------------------- #
FROM base AS deps
WORKDIR /app

# --------------------------- Install Dependencies --------------------------- #
RUN apt-get update && apt-get install -y libc6 g++ make
COPY package.json bun.lockb* yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN bun install --ignore-scripts
RUN bun add sharp --ignore-scripts

# ---------------------------------------------------------------------------- #
#                                   Building                                   #
# ---------------------------------------------------------------------------- #
FROM base AS builder
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --------------------------- Environment Variables -------------------------- #
ENV NEXT_TELEMETRY_DISABLED=1

# ---------------------------------- Prisma ---------------------------------- #
RUN bunx prisma generate

# ----------------------------------- Build ---------------------------------- #
RUN bun run build

# ---------------------------------------------------------------------------- #
#                                    Running                                   #
# ---------------------------------------------------------------------------- #
FROM base AS runner
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

COPY prisma ./prisma

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 bunjs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static

USER nextjs

ARG PORT
ENV PORT=$PORT
EXPOSE $PORT

ENV HOSTNAME="0.0.0.0"
CMD ["sh", "-c", "bunx prisma migrate deploy && bun server.js"]
