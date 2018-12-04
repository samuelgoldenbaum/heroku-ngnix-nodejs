# heroku-ngnix-nodejs
Example of setting up NGINX and Node.js within a Heroku dyno.

Sample application using Node.js (socket.io) and NGINX buildpack to enable NGINX as a reverse-proxy for your Node.js application. Follow the [Heroku NGNIX buildpack installtion steps](https://github.com/heroku/heroku-buildpack-nginx) to add the buildpack to your application.

### Setup
In summary you need to simply run the following from the Heroku CLI to create a new Heroku app and add the Node.js and NGNIX buildpacks:
```javascript
$ heroku create
$ heroku buildpacks:add heroku/nodejs
$ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nginx
$ git add .
$ git commit -am "init"
$ git push heroku master
$ heroku logs -t
```

### Key Points:
Your Node.js server must listen to the unix socket at `/tmp/nginx.socket`:
```javascript
// listen to ngnix socket
server.listen('/tmp/nginx.socket', function () {
    console.info(`server up`);
});
```

and let NGNIX know you want to start listening by touch `/tmp/app-initialized` file:
```javascript
const fs = require('fs');

// let ngnix know we want to start serving from the proxy
fs.openSync('/tmp/app-initialized', 'w');
```

The NGNIX config file is located in `/config/nginx.conf.erb` The [nginx.conf.erb](https://github.com/samuelgoldenbaum/heroku-ngnix-nodejs/blob/master/config/nginx.conf.erb) in the repo should have all you needed. In particular, pay attention to setting the upstream Node.js server:

```javascript
upstream websocket {
    server unix:/tmp/nginx.socket fail_timeout=0;
}
```
 and then specify that the http location section::
```javascript
proxy_pass http://websocket;
```
