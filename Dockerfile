FROM mhart/alpine-node:10

WORKDIR /usr/src/app
COPY node_modules ./node_modules
COPY index.js ./

CMD [ "node", "index.js" ]