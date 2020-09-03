FROM node:12-alpine as nodeBuilderStage

WORKDIR /container

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 3000


CMD [ "npm", "start" ]

