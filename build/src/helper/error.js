"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var serverError = function serverError(request, response) {
  response.status(500).json({
    status: 500,
    Error: "Something went wrong. Try again later"
  });
};

var _default = serverError;
exports.default = _default;