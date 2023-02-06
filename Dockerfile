# Development image

FROM node:18.13.0-bullseye-slim as development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
COPY ./src ./src

CMD ["npm", "run", "start:dev"]