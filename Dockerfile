FROM node:12.16

WORKDIR /app

COPY package.json ./

RUN apt-get update

RUN yarn install

COPY . /app

EXPOSE 3000
