FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production && \
    rm -rf src tsconfig.json

EXPOSE 8080

USER node

CMD ["npm", "run", "start"]