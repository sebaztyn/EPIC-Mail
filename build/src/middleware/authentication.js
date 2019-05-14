"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkToken = function checkToken(req, res, next) {
  try {
    var token = req.headers['x-authorization'];

    if (!token) {
      return res.status(401).json({
        error: "Token must be provided"
      });
    }

    var decoded = _jsonwebtoken.default.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        error: "Unable to authenticate token"
      });
    }

    req.tokenData = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: "Authentication failed"
    });
  }
};

var _default = checkToken;
exports.default = _default;