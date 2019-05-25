"use strict";

const path = require('path');
const HyperionClient = require('hyperion-client');

// init .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

// constants
const HYPERION_IP = process.env.HYPERION_IP;
const PING_IP = process.env.PING_IP;
const delay = 5000;

let hyperion;
let previousState;

function init(callback) {
  hyperion = new HyperionClient(HYPERION_IP, 19444, 100).on('connect', function () {
    console.log('connected to ' + HYPERION_IP);
    if (callback) setIntervalImmedately(callback, delay);
  }).on('error', function (err) {
    console.error('error connecting to hyperion', err);
    // retry in a little bit
    if (callback) setTimeout(() => init(callback), delay);
  });
}

function setIntervalImmedately(callback, ms) {
  callback();
  return setInterval(callback, ms);
}

function updateHyperion(currentState) {
  if (currentState != previousState) {
    if (currentState) {
      clear(undefined, true);
    } else {
      black(undefined, true);
    }
  }

  previousState = currentState;
}

function clear(res, retry) {
  hyperion.clear((err, result) => {
    console.log('clearing server state', result, err);
    if(res && err) res.sendStatus(500);
    else if (res) res.sendStatus(200);

    // Retry the command once if not connected
    if (err && retry) {
      init();
      setTimeout(() => clear(), delay / 2);
    }
  });
}

function black(res, retry) {
  hyperion.setColor([0, 0, 0], (err, result) => {
    console.log('set color: ', result, err);
    if(res && err) res.sendStatus(500);
    else if (res) res.sendStatus(200);

    // Retry the command once if not connected
    if (err && retry) {
      init();
      setTimeout(() => black(), delay / 2);
    }
  });
}

module.exports = {
  HYPERION_IP: HYPERION_IP,
  PING_IP: PING_IP,
  black: black,
  clear: clear,
  init: init,
  updateHyperion: updateHyperion,
};