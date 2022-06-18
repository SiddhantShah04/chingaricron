FROM node:15.7.0-alpine3.11 AS build

WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
RUN apk update && apk add python make g++

RUN apk add --no-cache git
RUN npm i --quiet

ADD . /app
RUN apk --no-cache upgrade

WORKDIR /app
CMD ["node","corn.js"]