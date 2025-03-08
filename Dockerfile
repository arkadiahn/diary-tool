FROM oven/bun:1 AS base

# ---------------------------------------------------------------------------- #
#                                 Dependencies                                 #
# ---------------------------------------------------------------------------- #
FROM base AS deps
RUN apt-get update && apt-get install -y libc6 g++ make openssh-client git
WORKDIR /app

ARG INTRA_APIS_DEPLOY_KEY
RUN if [ -z "${INTRA_APIS_DEPLOY_KEY}" ]; then \
    echo "Error: INTRA_APIS_DEPLOY_KEY is not set" && exit 1; \
    fi && \
    mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh && \
    echo "${INTRA_APIS_DEPLOY_KEY}" > /root/.ssh/id_ed25519 && \
    chmod 600 /root/.ssh/id_ed25519 && \
    # Validate the key by checking if it's readable by ssh-keygen
    ssh-keygen -y -f /root/.ssh/id_ed25519 > /dev/null && \
    ssh-keyscan github.com > /root/.ssh/known_hosts

COPY package.json bun.lockb* yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN bun install
RUN bun add sharp

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
RUN bun run build

# ---------------------------------------------------------------------------- #
#                                    Running                                   #
# ---------------------------------------------------------------------------- #
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 bunjs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["bun", "server.js"]
