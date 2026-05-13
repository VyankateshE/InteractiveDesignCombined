var http = require('http'),
    fs = require('fs');
const moment = require('moment');
let runDate = moment().format('YYYY-MM-DD');
runDate = runDate + " 15:30:00";
let dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
let dateTimeTo = moment(dateTime).add(24, 'hours').format('YYYY-MM-DD HH:mm:ss');
var sameDate = moment(dateTime).isSame(dateTime);
console.log(dateTime);
console.log(dateTimeTo);
console.log(runDate);
var fDate = moment(dateTime);
var fDate = moment(runDate);
console.log(dateTime);
console.log(runDate);
var boostDate = "2023-01-19 21:16:47.997+00";
var bDate = moment(boostDate);
var curDate = moment(dateTime);
var duration = moment.duration(curDate.diff(bDate));
var hours = duration.asHours();
console.log(bDate);
console.log(curDate);
console.log(hours);




