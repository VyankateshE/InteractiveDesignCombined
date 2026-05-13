const moment = require('moment');
// const geolib = require('geolib');

function sendResponse(res, statusCode = 200, message = [], data = [], header = []) {
    try {
        let dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let responsePayload = {
            "status": (statusCode == 200) ? 'Success' : "Failed",
            "statusCode": statusCode,
            "message": message,
            "data": data
        };
        return res.status(statusCode).send(responsePayload);
    } catch (err) {
        console.log(err)
        let responsePayload = {
            "status": "Failed",
            "statusCode": 500,
            "message": err.message,
            "data": []
        };
        return res.status(500).send(responsePayload);
    }
}

function errorResponse(res, statusCode = 500, message = [], data = [], header = []) {
    try {
        // Need to log server error
        let dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let responsePayload = {
            "status": "Failed",
            "statusCode": statusCode,
            "message": message,
            "data": data
        };
        return res.status(statusCode).send(responsePayload);
    } catch (err) {
        let responsePayload = {
            "status": "Failed",
            "statusCode": 500,
            "message": 'Internal Server Error',
            "data": data
        };
        return res.status(500).send(responsePayload);
    }
}

// function distance(lat, long, shoplat, shoplong,radius) {
//     // console.log('distance')
//     // console.log(lat)
//     // console.log(long)
//     // console.log(shoplong)
//     // console.log(radius)
//     return geolib.isPointWithinRadius({
//         latitude: shoplat,
//         longitude: shoplong
//     }, {
//         latitude: lat,
//         longitude: long
//     },radius);
// }

function validationErrors(res, errors) {
    var keyArr = { 'validationFailed': null }
    keyArr['validationFailed'] = errors.map(function (item) {
        return item["message"];
    });
    var dataErr = [];
    dataErr.push(keyArr)
    errorResponse(res, 422, "Invalid data", dataErr);
}

exports.sendResponse = sendResponse;
exports.errorResponse = errorResponse;
exports.validationErrors = validationErrors;
exports.moment = moment;