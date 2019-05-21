FROM mhart/alpine-node:10

WORKDIR /usr/src/app
COPY . .

CMD [ "node", "index.js" ]