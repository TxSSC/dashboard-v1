# TxSSC Dashboard!


## Each module must return an object, which has the Models, Collections, and Views attached.
### **{ Model: MyModel, Collection: MyCollection, Views: [ MyView1, MyView2 ]}**



```
.
├── app
│   ├── Main.coffee
│   └── templates
├── assets
│   ├── css
│   ├── img
│   └── js
├── build
│   ├── config.js
│   ├── index.js
│   └── tasks
├── index.html
├── modules
│   ├── lunch
│   │   ├── main.js
│   │   ├── style.css
│   │   └── templates
│   ├── ticket_system
│   │   ├── main.js
│   │   ├── style.css
│   │   └── templates
│   └── weather
│       ├── main.js
│       ├── style.css
│       └── templates
├── node_modules
│   ├── clean-css
│   ├── coffee-script
│   ├── express
│   ├── grunt
│   ├── hogan.js
│   └── rimraf
└── package.json
```



## Additions ##
- *[holman/play](https://github.com/holman/play)*
- Hipchat panel


## Example nginx api proxy config ##
```
server {
  listen    8080;

  location / {
      root /path/to/index/;
      index index.html;
  }

  #Proxy lunch requests
  location /lunch-proxy/ {
      rewrite ^/lunch-proxy/(.*)$ /$1 break;
      proxy_pass http://147.26.206.51;
        }

  #Proxy ticket requests
  location /ticket-proxy/ {
      rewrite ^/ticket-proxy/(.*)$ /$1 break;
      proxy_set_header X-Auth-Token [X-AUTH-TOKEN];
      proxy_pass http://txssc-tickets.herokuapp.com;
  }

  #Proxy weather requests
  location /weather-proxy/ {
      rewrite ^/weather-proxy/(.*)$ /$1 break;
      proxy_pass http://weather.yahooapis.com;
  }
}
```


## Configuration ##
- Set use nginx to set X-Auth-Token headers on all proxied apis