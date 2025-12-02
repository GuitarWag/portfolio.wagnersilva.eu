# Multi-stage Dockerfile for Next.js on Cloud Run
# Optimized for Cloud Run with native bindings (ONNX Runtime, Sharp)

# Stage 1: Dependencies
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies (this will compile native modules for Linux)
RUN npm ci --production

# Stage 2: Builder
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application in standalone mode
RUN npm run build

# Pre-download TTS model (Xenova/speecht5_tts) to be included in image
# Ensure cache directory exists before running preload script
RUN mkdir -p /root/.cache/huggingface && \
    echo "📥 Pre-downloading TTS model..." && \
    node scripts/preload-tts-model.mjs && \
    ls -la /root/.cache/huggingface

# Stage 3: Runner
FROM node:22-bookworm-slim AS runner
WORKDIR /app

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Copy standalone build from builder
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# Copy production dependencies with native bindings
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy pre-downloaded TTS model cache from builder
# This makes the model available immediately without download on first request
# Create target directory first, then copy
RUN mkdir -p /home/nodejs/.cache/huggingface
COPY --from=builder --chown=nodejs:nodejs /root/.cache/huggingface /home/nodejs/.cache/huggingface

# Switch to non-root user
USER nodejs

# Expose Cloud Run port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Start application
CMD ["node", "server.js"]
