Dashboard
==============

## Project is split into the api and client portions.
### Project layout
```
.
├── api
│   ├── app.js
│   ├── config
│   ├── lib
│   └── test
├── client
│   ├── app
│   ├── assets
│   ├── build
│   ├── index.html
│   ├── modules
│   └── readme.md
├── package.json
└── readme.md
```
## Overview
The dashboard runs under an instance of node-http-proxy, the default port is 3000

## Config
#### Environment variables
- LUNCH_HOST - the url or ip address of the whats for lunch server
- LUNCH_PORT - the port number that the lunch server is running on
- TICKET_HOST - the url or address of the ticket system server
- TICKET_PORT - the port number that the ticket system is running on

## Build client
- `cd client/ && node build