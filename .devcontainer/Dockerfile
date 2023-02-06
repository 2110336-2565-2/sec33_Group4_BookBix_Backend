FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

COPY ../package*.json ./
RUN npm install

COPY ../tsconfig.json ./
COPY ../tsconfig.build.json ./
COPY ../src ./src

CMD ["npm", "run", "start:dev"]