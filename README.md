# hyperion-toggle
A small watchdog to turn off hyperion when the main monitor / computer is not turned on

## Configuration
You need a `.env` file on both windows and linux. On windows (or device with screen, it needs just hyperion ip). On the linux / hyperion server it needs both an ip to ping and its own ip.

A sample file looks like this:
```
PING_IP=192.168.1.108
HYPERION_IP=192.168.1.109
```

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