FROM node:22.19.0 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p node_modules/.tmp
RUN npm run build

# Stage 2: Serve the app
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
