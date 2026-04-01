FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

ENV WORKER_ENTRY=workers/runtimeSupervisor.ts

# Use tsx to support TypeScript path aliases
CMD ["npx", "tsx", "workers/runtimeSupervisor.ts"]
