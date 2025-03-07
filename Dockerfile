FROM node:18-alpine AS base

# ---------------------------------------------------------------------------- #
#                                 Dependencies                                 #
# ---------------------------------------------------------------------------- #
FROM base AS deps
RUN apk add --no-cache libc6-compat
RUN apk add g++ make python3 py3-pip
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm install
RUN npm install sharp

# ---------------------------------------------------------------------------- #
#                                   Building                                   #
# ---------------------------------------------------------------------------- #
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --------------------------- Environment Variables -------------------------- #

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

ARG TOP_LEVEL_DOMAINS
ENV TOP_LEVEL_DOMAINS=$TOP_LEVEL_DOMAINS

ARG NEXT_PUBLIC_KEYCLOAK_ISSUER
ENV NEXT_PUBLIC_KEYCLOAK_ISSUER=$NEXT_PUBLIC_KEYCLOAK_ISSUER

ARG KEYCLOAK_SECRET
ENV KEYCLOAK_SECRET=$KEYCLOAK_SECRET

ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID

ARG COOKIE_DOMAINS
ENV COOKIE_DOMAINS=$COOKIE_DOMAINS

ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID

ARG NEXT_PUBLIC_UMAMI_URL
ENV NEXT_PUBLIC_UMAMI_URL=$NEXT_PUBLIC_UMAMI_URL

ENV NEXT_TELEMETRY_DISABLED=1

# ----------------------------------- Build ---------------------------------- #
RUN npm run build

# ---------------------------------------------------------------------------- #
#                                    Running                                   #
# ---------------------------------------------------------------------------- #
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
