const Ping = require('ping');
const Screen = require('screen-info');
const HyperionClient = require('hyperion-client');

// init .env
require('dotenv').config();

// constants
const interval = 5000;
const HYPERION_IP = process.env.HYPERION_IP;
const PING_IP = process.env.PING_IP;

let displayState;
let hyperion;

// On pi ping windows, on windows check displays
init(PING_IP ? ping : checkDisplays);

function init(callback) {
  hyperion = new HyperionClient(HYPERION_IP, 19444, 100).on('connect', function(){
    console.log('connected to ' + HYPERION_IP);
    setIntervalImmedately(callback, interval);
  }).on('error', function(err){
    console.error('error connecting to hyperion', err);
    // retry in a little bit
    setTimeout(initClient, interval);
  });
}

function setIntervalImmedately(callback, seconds) {
  callback();
  return setInterval(callback, seconds * 1000);
}

function ping() {
  Ping.sys.probe(process.env.PING_IP, function(isAlive){
    updateHyperion(isAlive);
  });
}

function checkDisplays() {
  let displayOn = false;
  Screen.all().forEach(s => {
    displayOn |= (s.width > 1920 && s.height > 1080);
  });

  updateHyperion(displayOn);
}

function updateHyperion(currentState) {
  if (currentState != displayState) {
    if (currentState) {
      hyperion.clear((err, result) => console.log('clearing server state', result, err));
    } else {
      hyperion.setColor([0, 0, 0], (err, result) => console.log('set color: ', result, err));
    }
  }

  displayState = currentState;
}