# First stage: build app
FROM node:12-alpine AS builder

RUN apk add --update --no-cache \
    python \
    make \
    g++

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./src ./src

RUN npm ci

RUN npm run build

RUN npm prune --production

# Second stage: run app
FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=builder ./usr/src/app/node_modules ./node_modules
COPY --from=builder ./usr/src/app/package*.json ./
COPY --from=builder ./usr/src/app/dist ./dist

COPY ./images ./images

EXPOSE 3000
CMD [ "npm", "start" ]