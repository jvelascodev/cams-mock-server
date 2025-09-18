# Multi-stage Dockerfile for CAMS Mock Server

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (set npm to ignore SSL for this build)
RUN npm config set strict-ssl false && \
    npm install && \
    npm config delete strict-ssl

# Copy source code
COPY . .

# Build the application using npx to ensure tsc is available
RUN npx tsc

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S cams -u 1001

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm config set strict-ssl false && \
    npm install --only=production && \
    npm cache clean --force && \
    npm config delete strict-ssl

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy documentation
COPY --from=builder /app/docs ./docs

# Change ownership to non-root user
RUN chown -R cams:nodejs /app
USER cams

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(res => res.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the application
CMD ["npm", "start"]