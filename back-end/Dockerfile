FROM node:12-alpine as nodeBuilderStage

RUN apk add --no-cache curl && \
    apk add --no-cache bash   

WORKDIR /container

COPY package.json .
RUN npm install 
    
COPY . .

RUN npm run build



HEALTHCHECK --interval=5m --timeout=10s --start-period=10s --retries=5 CMD curl -f http://localhost:8080/public/status || exit 1

EXPOSE 8080

CMD [ "npm", "start" ]