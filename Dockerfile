FROM node:20-alpine AS builder

WORKDIR /app

ARG CONFIGURATION=staging

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration ${CONFIGURATION}

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/kamak-web/browser /usr/share/nginx/html

EXPOSE 80
