var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
var returnHeader = {
  useragent: "",
  language: "",
  ip: "",
  question: "Who are you?"
}
app.get('/whoami', function(request, response) {
  var newHeader = JSON.stringify(request.headers).split("");

  for (let i = 0; i < newHeader.length; i++) {
    if (newHeader[i] == "-") {
      newHeader[i] = "";
    }
  }
  var joinedHeader = newHeader.join("");
  var backToObj = JSON.parse(joinedHeader);

  returnHeader.useragent = backToObj.useragent;
  returnHeader.language = backToObj.acceptlanguage;
  returnHeader.ip = backToObj.xforwardedfor;

  response.send(returnHeader);
});

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

module.exports = app;
