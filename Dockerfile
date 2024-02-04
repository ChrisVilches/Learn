# TODO: This is for webapp only. Rename file accordingly?

FROM node:21-alpine

WORKDIR /user/app

COPY ./packages/webapp ./packages/webapp
COPY ./packages/problem-generator ./packages/problem-generator
COPY package*.json ./

# TODO: --omit=dev. But it needs `tsc` so I can't use it for now.
RUN npm install
RUN npx prisma generate --schema=./packages/webapp/prisma/schema.prisma --generator=client

RUN npm run build --prefix packages/problem-generator
RUN npm run build --prefix packages/webapp

# TODO: It should be possible to put this at the start of the file,
#       but some build tasks fail.
ENV NODE_ENV production
ENTRYPOINT ["npm", "run", "start:prod", "--prefix", "packages/webapp"]
