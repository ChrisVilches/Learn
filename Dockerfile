# TODO: This is for webapp only. Rename file accordingly?

FROM node:21-alpine

ENV NODE_ENV production
WORKDIR /user/app

COPY ./packages/webapp ./packages/webapp
COPY ./packages/problem-generator ./packages/problem-generator
COPY package*.json ./

RUN npm install
RUN npx prisma generate --schema=./packages/webapp/prisma/schema.prisma

RUN npm run build --prefix packages/problem-generator
RUN npm run build --prefix packages/webapp

ENTRYPOINT ["npm", "run", "start:prod", "--prefix", "packages/webapp"]
