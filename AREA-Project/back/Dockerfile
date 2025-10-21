FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestuser -u 1001 -G nodejs

COPY package.json package-lock.json* ./

RUN npm ci --silent --no-fund --ignore-scripts && \
    npm cache clean --force

COPY . .

RUN chown -R nestuser:nodejs /app
USER nestuser

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestuser -u 1001 -G nodejs

WORKDIR /app

COPY --from=builder --chown=nestuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestuser:nodejs /app/package*.json ./
COPY --from=builder --chown=nestuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nestuser:nodejs /app/prisma ./prisma

USER nestuser

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma generate && npx prisma db push && npm run start:prod"]
