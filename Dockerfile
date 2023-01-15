FROM node:19-alpine

WORKDIR /home/node/app
COPY package*.json ./

RUN npm install

RUN echo "$PWD"

RUN chown -R node:node /home/node/app

RUN npm cache clean --force

USER node

COPY --chown=node:node . .
EXPOSE 8080

CMD [ "npm", "start" ]
