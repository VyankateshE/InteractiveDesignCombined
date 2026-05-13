#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var http = require('http');
//var https = require('https');
var fs = require('fs');
var path = require('path');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3005');
app.set('port', port);

/**
 * Create HTTP server.
 */

//changes for https://localhost:3003

//var server = https.createServer(
// { key : fs.readFileSync(path.join(__dirname,"server.key")),
//  cert : fs.readFileSync(path.join(__dirname,"server.cert"))
// },app);
var server = http.createServer(app)
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);


/**
 * 
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

