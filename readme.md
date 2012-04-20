TxSSC Dashboard
==============

## Project is split into the api and client portions.
### Project layout
```
.
├── api
│   ├── app.js
│   ├── controllers
│   ├── sockets
│   └── test
├── client
│   ├── app
│   ├── assets
│   ├── build
│   ├── index.html
│   ├── modules
│   ├── config.json
│   └── readme.md
├── package.json
└── readme.md
```

## Config
#### Environment variables
`DASHBOARD_PORT` - specifies which port the dashboard should listen on

## To build client
- `cd client/ && node build`