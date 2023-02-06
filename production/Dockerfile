# Production image
FROM node:18.13.0 AS builder

COPY ../package.json ./
RUN npm install

COPY ./../tsconfig.json ./
COPY ./../tsconfig.build.json ./
COPY ./../src ./src
COPY ./../.env ./.env

RUN npm run build
# ./dist is the output folder

FROM node:18.13.0-bullseye-slim

COPY ../package.json ./
RUN npm install --production

COPY --from=builder ./dist/ ./dist/

CMD ["npm", "run", "start:prod"]