const mkdirp = require('mkdirp');
const fs = require('fs');
const date = new Date();
const shortMonthsName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const shortMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const year = date.getFullYear();
const month_name = short_months_name(date.getMonth());
const month = short_months(date.getMonth());
const day = date.getDate();
const file_name = year + month + day;
const log = 'logs/';
const models = require('../../models');

function short_months_name(month) {
    return shortMonthsName[month];
}

function short_months(month) {
    return shortMonths[month];
}

function create_log(userid,requestId,reqtype,response_array) {
    models.Logger.create({
            user_id: userid,
            request_id: requestId,
            request_type: reqtype,
            response: response_array
        });
}
exports.create_log = create_log;