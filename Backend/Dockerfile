# Stage 1: Build stage
FROM node:20.12.2-buster-slim AS builder

# Create a non-root user for build
RUN if ! id nodeuser > /dev/null 2>&1; then \
        groupadd -r nodeuser && useradd -r -g nodeuser -u 1001 nodeuser; \
    fi

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --legacy-peer-deps && npm audit fix --force

# Copy application code
COPY . ./

# Change ownership of the app directory to the non-root user
RUN chown -R nodeuser:nodeuser /app

# Switch to non-root user for build
USER nodeuser

# Stage 2: Production stage (Alpine for smaller size)
FROM node:20.12.2-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create a non-root user for production
RUN addgroup -g 1001 nodeuser && \
    adduser -D -s /bin/sh -u 1001 -G nodeuser nodeuser

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force && \
    rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

# Copy application code from builder stage
COPY --from=builder --chown=nodeuser:nodeuser /app ./

# Switch to non-root user
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
