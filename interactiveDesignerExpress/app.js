const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config/config.json');
const globalData = require('./services/global.json');
const _sendResponse = require('./app/helper/global').sendResponse;
// const locationUtilsR = require('./utils/location');
// const locationUtils = new locationUtilsR();
var session = require('express-session');
const cors = require('cors');
const app = express();
// const fileupload = require('express-fileupload');
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
// schedular Process
const schedule = require('./services/schedular');
var bodyParser = require('body-parser')
var timeout = require('connect-timeout')
app.use(timeout('300s'));
// app.use(fileupload());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('etag', false);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({
  extended: true
}));
global.__basedir = __dirname + "";
console.log(path.join(__dirname, 'uploads/'));
app.use(bodyParser.text({ type: '/' }));


app.use(cors());

// app.use(nocache())
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const uploadFile = require('./middleware/uploadexcel');
app.global = globalData;
app.config = config;


const location = require('./routes/v1/location.js');


app.use('/api/v1/s3Upload', uploadFile.single('file'), location);


// app.use('/users', usersRoutes)
app.use(function (req, res, next) {
  _sendResponse(res, 404, "Route Not Found");
});




// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//cron.schedule('*/10 * * * * *', () => {console.log("Task is running every minute " + new Date())});

// Start the server and listen on a specific port
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;