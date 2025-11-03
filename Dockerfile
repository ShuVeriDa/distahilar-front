# Multi-stage build for production optimization

# Stage 1: Dependencies stage
FROM node:18-alpine AS deps

WORKDIR /app

# Install dependencies needed to build native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Builder stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build Next.js application
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public

# Set working directory
RUN mkdir -p .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]

