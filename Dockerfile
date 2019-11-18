FROM node:10.13-alpine

RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

RUN npm run build

ENV SERVER_PORT=3000
EXPOSE ${SERVER_PORT}

CMD [ "node", ".\dist\main.js" ]
