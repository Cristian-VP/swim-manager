# ─────────────────────────────────────────────
# Stage 1 – Build
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only the dependency manifests first so Docker can cache this layer
# independently of source-code changes.
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed by the build)
RUN npm ci

# Copy the rest of the source tree
COPY . .

# Compile TypeScript and generate the production bundle in /app/dist
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 – Serve
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove the default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# nginx runs in the foreground by default in the official image
CMD ["nginx", "-g", "daemon off;"]
