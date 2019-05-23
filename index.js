const electron = require('electron');
const { app } = require('electron');
const path = require('path');
const Ping = require('ping');
const HyperionClient = require('hyperion-client');

// init .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

// constants
const interval = 5000;
const HYPERION_IP = process.env.HYPERION_IP;
const PING_IP = process.env.PING_IP;

let displayState;
let hyperion;

app.on('ready', () => {
  if (!HYPERION_IP) {
    console.error('you need to make a .env file with your IP addresses configured');
    process.exit(1);
  }
  
  // On pi ping windows, on windows check displays
  if (PING_IP) {
    console.log('going to ping desktop');
    init(ping);
  } else {
    console.log('going to check desktop displays');
    init(checkDisplays);
  }
});

function init(callback) {
  hyperion = new HyperionClient(HYPERION_IP, 19444, 100).on('connect', function(){
    console.log('connected to ' + HYPERION_IP);
    setIntervalImmedately(callback, interval);
  }).on('error', function(err){
    console.error('error connecting to hyperion', err);
    // retry in a little bit
    setTimeout(init, interval);
  });
}

function setIntervalImmedately(callback, ms) {
  callback();
  return setInterval(callback, ms);
}

function ping() {
  Ping.sys.probe(PING_IP, function(isAlive){
    updateHyperion(isAlive);
  });
}

function checkDisplays() {
  let displayOn = false;
  electron.screen.getAllDisplays().forEach(s => {
    displayOn = displayOn || (s.size.width > 1920 && s.size.height > 1080);
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