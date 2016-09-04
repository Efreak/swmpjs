# SWMPjs

A port of [fuzzymannerz/swmp](https://github.com/fuzzymannerz/swmp) to nodejs.

I liked this script when I saw it posted on reddit, and decided to rewrite the backend for nodejs.

To run:

```bash
npm install swmpjs
swmpjs
```

There are several options:

| option | default | meaning |
|--------|---------|---------|
| --errors | false | show errors or hide them |
| --listen | 127.0.0.1 | what ip to bind to |
| --port | 8000 | what port to bind to |
| --theme | simplex | pick a theme from [css/themes](https://github.com/Efreak/swmpjs/tree/master/css/themes). You can preview themes by appending `?theme=name` to the url. |
| --interface | eht0 | what interface to list the IP(s) for at the top, next to the hostname |
