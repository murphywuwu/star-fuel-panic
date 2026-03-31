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

CMD ["sh", "-lc", "node --experimental-strip-types \"$WORKER_ENTRY\""]
