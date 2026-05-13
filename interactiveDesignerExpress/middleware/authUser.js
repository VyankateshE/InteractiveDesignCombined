const jwt = require('jsonwebtoken');
const _sendResponse = require('../app/helper/global').sendResponse;
const _errorResponse = require('../app/helper/global').errorResponse;

module.exports = function authUser(req, res, next) {
	const token = (req.headers.authuser) ? req.headers.authuser : null;
	if (!token) {
		_errorResponse(res, 401, "Unauthorized token");
		//req.user = null
	}
	jwt.verify(token, req.app.config.jwt.secret, (err, user) => {
		if (err) {
			_errorResponse(res, 403, "Unauthorized");
		}
		req.user = user
		next();
	});
}