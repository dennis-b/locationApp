# my location app
simple app with ionic/cordova.
build with webpack.
for development use webpack-dev-server.


# Getting Started
Make sure you have [Nodejs](https://nodejs.org/)

```
$ git clone https://github.com/dennis-b/locationApp.git # or clone your own fork
$ npm install -g cordova ionic
$ cd locationApp
$ npm install
$ npm start
$ navigate to http://localhost:3000/
```

# for mobile:

```
$ git clone https://github.com/dennis-b/locationApp.git # or clone your own fork
$ npm install -g cordova ionic
$ cd locationApp
$ npm install
$ npm run prod
$ ionic state reset # will add android platform, if you want ios, run ionic platform add ios and then ionic state reset
$ ionic run android # or ios


```

# Tested with:

Cordova CLI: 6.1.1
Gulp version:  CLI version 3.9.1
Ionic CLI Version: 1.7.14
Ionic App Lib Version: 0.7.0
OS:Android 6
Node Version: v4.2.3