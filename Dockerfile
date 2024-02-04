# TODO: This is for webapp only. Rename file accordingly?
# TODO: Instead of "webapp" use the app name (i.e. currently "learn") since in `docker images`
#       and `docker ps` it's a bit vague.

FROM node:21-alpine as build

WORKDIR /user/app

COPY ./packages/webapp ./packages/webapp
COPY ./packages/problem-generator ./packages/problem-generator
COPY package*.json ./

# TODO: --omit=dev. But it needs `tsc` so I can't use it for now.
RUN npm install
RUN npx prisma generate --schema=./packages/webapp/prisma/schema.prisma --generator=client

RUN npm run build --prefix packages/problem-generator
RUN npm run build --prefix packages/webapp

FROM node:21-alpine as db
COPY --from=build . .
WORKDIR /user/app/packages/webapp
CMD npx prisma migrate deploy && npx prisma db seed

FROM node:21-alpine as app
# TODO: It should be possible to put this at the start of the file,
#       but some build tasks fail.
ENV NODE_ENV production
COPY --from=build . .
WORKDIR /user/app/packages/webapp
RUN apk add --no-cache python3 py3-pip
RUN apk add py3-numpy
ENTRYPOINT ["npm", "run", "start:prod"]
