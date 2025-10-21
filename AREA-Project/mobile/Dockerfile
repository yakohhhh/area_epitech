# Production build container (serves built web assets for preview / CI)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY ionic.config.json ./
COPY capacitor.config.ts ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
# Basic health check file
RUN echo "OK" > /usr/share/nginx/html/health.txt
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O - http://localhost:8080/health.txt || exit 1
CMD ["nginx","-g","daemon off;"]
