FROM mhart/alpine-node:10

WORKDIR /usr/src/app

# Dependencies
COPY package.json ./
RUN npm install

COPY index.js ./
CMD [ "node", "index.js" ]