FROM node:22

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches

RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["pnpm", "exec", "expo", "start", "--host", "lan", "--port", "8081"]
