"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userResponse = exports.authResponse = exports.serverResponse = exports.serverError = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var serverError = function serverError(response) {
  return response.status(500).json({
    status: 500,
    Error: "Something went wrong. Try again later"
  });
};

exports.serverError = serverError;

var serverResponse = function serverResponse(response, statusValue) {
  var _response$status$json;

  for (var _len = arguments.length, values = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    values[_key - 2] = arguments[_key];
  }

  var statusKey = values[0],
      dataKey = values[1],
      dataValue = values[2];
  return response.status(statusValue).json((_response$status$json = {}, _defineProperty(_response$status$json, statusKey, statusValue), _defineProperty(_response$status$json, dataKey, dataValue), _response$status$json));
};

exports.serverResponse = serverResponse;

var authResponse = function authResponse(response, statusValue) {
  for (var _len2 = arguments.length, values = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    values[_key2 - 2] = arguments[_key2];
  }

  var dataKey = values[0],
      dataValue = values[1];
  return response.status(statusValue).json(_defineProperty({}, dataKey, dataValue));
};

exports.authResponse = authResponse;

var userResponse = function userResponse(response, statusValue, userData) {
  return response.status(statusValue).json({
    status: 201,
    data: userData
  });
};

exports.userResponse = userResponse;