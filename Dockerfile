FROM node:10-alpine

RUN npm install

RUN sudo mkdir -p /home/node/app/node_modules && sudo chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node

COPY --chown=node:node . .
EXPOSE 8080
CMD [ "npm", "start" ]
