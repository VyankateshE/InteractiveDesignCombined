const cron = require('node-cron');

cron.schedule('00 */12 * * *', () => {
  var request = require('request');
  var options = {
    'method': 'GET',
    'url': 'https://api.xcibil.com/api/v1/user/getUserList',
    //   'url': 'http://localhost:3004/api/v1/user/getUserList',
    // 'url': 'http://api.newpaytm.com/api/v1/user/getUserList',
    'headers': {
      'Cookie': 'connect.sid=s%3AsGSdV4nGRS-JPRd5oYaKdX2Xkz6byHF9.ymjeI7wXrd401buDf%2BT5IqLeLvsf5FKVQ9W0BrrQVp0'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("Schedular Process");
  });

});
