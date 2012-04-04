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

## Config
#### Environment variables
- LUNCH_SERVER - the url or ip address of the whats for lunch server
- LUNCH_PORT - the port number that the lunch server is running on

## Build client
- `cd client/ && node build