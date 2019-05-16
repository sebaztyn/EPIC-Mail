"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _serverResponse = require("../helper/serverResponse");

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkToken = function checkToken(req, res, next) {
  try {
    var token = req.headers['x-authorization'];

    if (!token) {
      return (0, _serverResponse.authResponse)(res, 401, 'error', 'Token must be provided');
    }

    var decoded = _jsonwebtoken.default.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return (0, _serverResponse.authResponse)(res, 401, 'error', 'Unable to authenticate token');
    }

    req.tokenData = decoded;
    return next();
  } catch (err) {
    return (0, _serverResponse.authResponse)(res, 401, 'error', 'Authentication failed');
  }
};

var _default = checkToken;
exports.default = _default;