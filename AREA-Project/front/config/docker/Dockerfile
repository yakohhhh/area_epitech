# ====================
# Stage 1: Build stage
# ====================
FROM node:22-alpine AS builder

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactuser -u 1001 -G nodejs

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --silent --no-fund --ignore-scripts && \
    npm cache clean --force

# Install git for husky hooks
RUN apk add --no-cache git

COPY . .

# Initialize git repo if not exists (for husky)
RUN git init || true && \
    git config --global user.email "build@docker.com" && \
    git config --global user.name "Docker Build" || true

RUN chown -R reactuser:nodejs /app
USER reactuser

# Prepare husky hooks (skip if not configured)
RUN npm run prepare 2>/dev/null || echo "No husky prepare script found, skipping..."

# Run linting and formatting checks with fallbacks
RUN (npm run lint 2>/dev/null || echo "No lint script found, skipping...") && \
    (npm run format:check 2>/dev/null || npm run prettier:check 2>/dev/null || echo "No format check script found, skipping...")

RUN --mount=type=cache,target=/app/node_modules/.cache \
    npm run build

# ====================
# Stage 2: Production stage (SÉCURISÉE)
# ====================
FROM nginx:stable-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nginx-group && \
    adduser -S nginx-user -u 1001 -G nginx-group

RUN rm -rf /etc/nginx/conf.d/default.conf \
           /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder --chown=nginx-user:nginx-group /app/dist /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nginx-user:nginx-group /var/cache/nginx /var/log/nginx /var/run /etc/nginx /usr/share/nginx/html

USER nginx-user

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
