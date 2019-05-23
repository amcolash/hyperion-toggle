"use strict";

const Ping = require('ping');
const Util = require('./util');

if (!Util.HYPERION_IP || !Util.PING_IP) {
  console.error('you need to make a .env file with your IP addresses configured');
  process.exit(1);
}

console.log('going to check desktop displays');
Util.init(ping);

function ping() {
  Ping.sys.probe(Util.PING_IP, function (isAlive) {
    Util.updateHyperion(isAlive);
  });
}