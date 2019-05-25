"use strict";

const express = require('express');
const Ping = require('ping');
const { spawn } = require('child_process');
const Util = require('./util');

if (!Util.HYPERION_IP || !Util.PING_IP) {
  console.error('you need to make a .env file with your IP addresses configured');
  process.exit(1);
}

const PORT = 19445;
const app = express();

console.log('going to check desktop displays');
Util.init(ping);

function ping() {
  Ping.sys.probe(Util.PING_IP, function (isAlive) {
    Util.updateHyperion(isAlive);
  });
}

function runCommand(res, command, params) {
  const cmd = spawn(command, params);

  cmd.stdout.on('data', data => console.log(`stdout: ${data}`));
  cmd.stderr.on('data', data => console.log(`stderr: ${data}`));
  cmd.on('close', code => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) res.sendStatus(200);
    else res.sendStatus(500);
  });
}


app.listen(PORT, () => console.log('Running server on port: ' + PORT));
app.get('/', (req, res) => res.send('HyperionToggle server runnning'));

const friendlyNames = {
  'black_leds': 'Turn off HyperionToggle LEDS',
  'clear_leds': 'Clear HyperionToggle LEDS',
  'shutdown': 'Shutdown Raspberry Pi',
  'reboot': 'Reboot Raspberry Pi',
  'start_service': 'Start Hyperion service',
  'stop_service': 'Stop Hyperion service',
  'restart_service': 'Restart Hyperion service'
};
app.get('/commands', (req, res) => {
  // Get a list of routes that are not '/' and '/commands'
  const routes = app._router.stack
    .filter(r => r.route && r.route.path !== '/' && r.route.path !== '/commands')
    .map(r => { return { path: r.route.path, name: friendlyNames[r.route.path.replace('/', '')] } })
  
  res.send(routes);
});

app.get('/black_leds', (req, res) => Util.black(res));
app.get('/clear_leds', (req, res) => Util.clear(res));
app.get('/ls', (req, res) => runCommand(res, 'sudo', ['ls']));
app.get('/reboot', (req, res) => runCommand(res, 'sudo', ['reboot', 'now']));
app.get('/shutdown', (req, res) => runCommand(res, 'sudo', ['shutdown', 'now']));
app.get('/start_service', (req, res) => runCommand(res, 'sudo', ['service', 'hyperion', 'start']));
app.get('/stop_service', (req, res) => runCommand(res, 'sudo', ['service', 'hyperion', 'stop']));
app.get('/restart_service', (req, res) => runCommand(res, 'sudo', ['service', 'hyperion', 'restart']));