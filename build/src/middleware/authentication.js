"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _serverResponse = require("../helper/serverResponse");

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint dot-notation: 0 */
var checkToken = function checkToken(req, res, next) {
  try {
    var header = req.headers.authorization;

    if (!header) {
      return (0, _serverResponse.authResponse)(res, 403, 'error', 'Token must be provided');
    }

    var bearer = header.split(' ');
    var token = bearer[1];

    var decoded = _jsonwebtoken.default.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return (0, _serverResponse.authResponse)(res, 403, 'error', 'Unable to authenticate token');
    }

    req.tokenData = decoded;
    return next();
  } catch (err) {
    return (0, _serverResponse.authResponse)(res, 403, 'error', 'Authentication failed');
  }
};

var _default = checkToken;
exports.default = _default;