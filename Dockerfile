# Use Debian-based Node.js image (required for onnxruntime-node glibc dependency)
# DO NOT use Alpine - onnxruntime-node requires glibc, Alpine uses musl
FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Copy onnxruntime-node binaries to standalone build
# Next.js standalone doesn't include all node_modules, must manually copy ONNX binaries
RUN mkdir -p .next/standalone/node_modules/onnxruntime-node && \
    cp -r node_modules/onnxruntime-node/bin .next/standalone/node_modules/onnxruntime-node/ && \
    cp node_modules/onnxruntime-node/package.json .next/standalone/node_modules/onnxruntime-node/

# Copy @huggingface/transformers to standalone build
RUN mkdir -p .next/standalone/node_modules/@huggingface && \
    cp -r node_modules/@huggingface/transformers .next/standalone/node_modules/@huggingface/

# Set environment variables
ENV NODE_ENV=production
ENV TRANSFORMERS_CACHE=/tmp/.cache

# Expose port
EXPOSE 3000

# Start the application using standalone server
CMD ["node", ".next/standalone/server.js"]
