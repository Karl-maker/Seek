FROM node:19-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm i

FROM node:19-alpine AS dev
WORKDIR /app
ENV NODE_ENV = development
COPY --from=dependencies /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY . .
CMD ["npm", "run", "dev"]

FROM node:19-alpine AS production
WORKDIR /app
ENV NODE_ENV = production
COPY --from=dependencies /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
