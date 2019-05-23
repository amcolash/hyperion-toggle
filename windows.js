"use strict";

const path = require('path');
const electron = require('electron');
const { app, Menu, Tray, nativeImage } = require('electron');
const Util = require('./util');

if (!Util.HYPERION_IP) {
  console.error('you need to make a .env file with your IP addresses configured');
  process.exit(1);
}

let tray = null;
app.on('ready', () => {
  // const iconPath = path.join(process.resourcesPath, 'icon_tray.png');
  let iconPath = "build/icon_tray.png";
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Exit', click: () => {
      app.quit();
    }}
  ]);
  tray.setToolTip('Hyperion Toggle');
  tray.setContextMenu(contextMenu);

  console.log('going to check desktop displays');
  Util.init(checkDisplays);
});

function checkDisplays() {
  let displayOn = false;
  electron.screen.getAllDisplays().forEach(s => {
    displayOn = displayOn || (s.size.width > 1920 && s.size.height > 1080);
  });

  Util.updateHyperion(displayOn);
}