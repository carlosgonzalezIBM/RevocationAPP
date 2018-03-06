var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);


var cfenv = require('cfenv');
var index = require('./routes/index');
var users = require('./routes/users');
var func  = require('./config/functions');


var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(function(req, res, next){
  res.io = io;
  next();
});

// next line is the money
// app.set('socketio', io);
//money

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.xml({
  xmlParseOptions: {
valueProcessors: [func.parseNumbers],
    explicitArray: false // Only put nodes in array if >1
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//--------------

//
// var appEnv = cfenv.getAppEnv();
//
const colors = require('colors');



io.on("connection",function(socket){
    /*Associating the callback function to be executed when client visits the page and
      websocket connection is made */

      func.gettokens(function(response){
      socket.emit('token',response);
      });


      socket.send("Connection with the server established"); //envia mensaje de connection with the server
      /*sending data to the client , this triggers a message event at the client side */
    console.log('Socket.io Connection with the client established'.blue);

    socket.on('revoketoken', function(token){ //si alguien se desconecta: log in console
      func.revoketoken(token,function(response){

      socket.emit('token',response);
      });
  });
  socket.on('disconnect', function(){ //si alguien se desconecta: log in console
  console.log('user disconnected'.grey);
});
  });

//
// // start server on the specified port and binding host
// var server =app.listen(appEnv.port, '0.0.0.0', function() {
//   console.log("----------- The Server is ready to run a Smarter Planet-----------".magenta);
// 	// print a message when the server starts listening
//   console.log("server starting on:\n" + appEnv.url);
// });

// module.exports = app;

module.exports = {app: app, server: server};
