# SWMPjs

[![GitHub version](https://img.shields.io/github/release/Efreak/swmpjs.svg?label=ver)](https://github.com/Efreak/swmpjs/releases/latest)
[![GitHub tag](https://img.shields.io/github/tag/Efreak/swmpjs.svg)](https://github.com/Efreak/swmpjs/tags/latest)
[![node](https://img.shields.io/node/v/swmpjs.svg)](https://npmjs.com/package/swmpjs)
[![Repo Size](https://reposs.herokuapp.com/?path=Efreak/swmpjs)]()
[![License](https://img.shields.io/badge/license-MIT-44CC11.svg)](https://efreak.mit-license.org)
[![Downloads per month](https://img.shields.io/npm/dm/swmpjs.svg?label=DLs)](https://npmjs.com/package/swmpjs)

[![Stats](https://nodei.co/npm/swmpjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/swmpjs/)

A port of [fuzzymannerz/swmp](https://github.com/fuzzymannerz/swmp) to nodejs.

**A responsive, eye-pleasing Linux server statistics dashboard.**
- [Screenshot](#non-fancy-fake-devices-screenshot-)
- [Requirements](#requirements)
- [Installation](#installation)
* [Options](#options)
- [Themes](#themes)
- [Show Some Love <3](#show-some-love-3)
- [Contributions & Credits](#contributions--credits)


![](http://i.imgur.com/q8XWluS.png)

### Non-"Fancy fake devices" Screenshot. ;)
![](https://i.imgur.com/zAIBKkd.png)

## Requirements
- Linux OS with...
- A Web Server. (Nginx, Apache etc...)
- NodeJS.

## Installation

### Download and install SWMPjs

```bash
npm install swmpjs
```
*OR*
```bash
npm install Efreak/swmpjs
```
*OR*
```bash
git clone https://github.com/Efreak/swmpjs.git
cd swmpjs
npm install .
```

### Run SWMPjs

```bash
swmpjs
```

### Edit your front-facing server config

For nginx, use something like the following in your config:

```
location /SWMPjs/ {
	proxy_pass http://localhost:8000/;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection 'upgrade';
	proxy_set_header Host $host;
	proxy_cache_bypass $http_upgrade;
	proxy_set_header X-Real-IP       $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## Options
| option | default | meaning |
|--------|---------|---------|
| --errors | false | show errors or hide them |
| --listen | 127.0.0.1 | what ip to bind to |
| --port | 8000 | what port to bind to |
| --theme | simplex | pick a theme from [css/themes](https://github.com/Efreak/swmpjs/tree/master/css/themes).|
| --interface | eht0 | what interface to list the IP(s) for at the top, next to the hostname |
| --reload | 60 | How often to reload the page automatically, in seconds |

## Themes
SWMPjs includes a selection of themes. The default being **simplex**. (The red and white one above)
![](http://i.imgur.com/vlw9NyV.png)
To use a different theme, either set it on the command-line or use `?theme=name` in the url.

Theme screenshots (and most of this readme) were shamelessly stolen from fuzzymanners' original repo. However, only the backend was rewritten--the frontend stayed the same. Therefore, you can also grab new themes from [fuzzymanners/swmp/css/themes](https://github.com/fuzzymannerz/swmp/tree/master/css/themes) if there are any.

## Contributions & Credits
**Feel free to contribute to SWMPjs, these guys already did:**
* [fuzzymanners](https://github.com/fuzzymannerz) - _Wrote the original, [SWMP](https://github.com/fuzzymannerz/swmp)_
* [TomasKostadinov](https://github.com/TomasKostadinov) - _Darkplex Theme._
* [daison12006013](https://github.com/daison12006013) - _Bugfixes._
* [Mikescher](https://github.com/Mikescher) - _~~Configuration file~~ and error messages._

**SWMPjs also wouldn't be possible without the use of these awesome projects:**
* [SWMP](https://github.com/fuzzymannerz/swmp)
* [eZ Server Monitor Web](https://github.com/shevabam/ezservermonitor-web)
* [Gauge JS](http://github.com/bernii/gauge.js)
* [Tablesaw](https://github.com/filamentgroup/tablesaw)
* [Twitter Bootstrap](https://github.com/twbs/bootstrap)
* [Bootswatch](https://github.com/thomaspark/bootswatch)
* [jQuery](https://github.com/jquery/jquery)
