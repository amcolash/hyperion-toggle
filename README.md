# hyperion-toggle
A small watchdog to turn off hyperion when the main monitor / computer is not turned on

## Windows vs. Linux
There are 2 different scripts that are run slightly differently

### Windows
I build electron binaries for this and then copied a shortcut to the startup folder for my user.
To build: `npm install && npm run dist`.

I got the monitor icon from [FeatherIcons](https://feathericons.com/).

This is for my host desktop and checks if the screen is turned on (it is a higher resolution than the duplicated one). If the screen is on, it clears all colors set via the linux watcher.

### Linux
I use `pm2` for this script `pm2 start linux.js --name HyperionToggle && pm2 save`.

This runs on my pi itself and pings the windows desktop to sets the hyperion color to black (effectively disabling the leds).