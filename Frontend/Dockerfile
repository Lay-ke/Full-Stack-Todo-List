# Stage 1: Build React app
FROM node:20.12-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build
CMD [ "ls" ]

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Create a non-root user for nginx (check if exists first)
RUN if ! id nginxuser > /dev/null 2>&1; then \
        addgroup -g 1001 nginxuser && \
        adduser -D -s /bin/sh -u 1001 -G nginxuser nginxuser; \
    fi

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change ownership of nginx directories
RUN chown -R nginxuser:nginxuser /var/cache/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx && \
    chown -R nginxuser:nginxuser /etc/nginx/conf.d && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

# Switch to non-root user
USER nginxuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
