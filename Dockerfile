FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/

RUN npm ci

COPY packages/server ./packages/server
COPY packages/client/dist ./packages/client/dist
COPY packages/admin/dist ./packages/admin/dist

CMD ["node", "--experimental-strip-types", "./packages/server/src/server.ts"]