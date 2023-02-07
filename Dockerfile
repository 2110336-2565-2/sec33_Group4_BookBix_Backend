
# FROM node:18.13.0-bullseye-slim as development

#  mcr.microsoft.com is Development image use for ease of development (need to change later)
FROM mcr.microsoft.com/devcontainers/javascript-node:0-18 as development 
WORKDIR /workspaces/app

COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli

COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
COPY ./src ./src

CMD ["npm", "run", "start:dev"]