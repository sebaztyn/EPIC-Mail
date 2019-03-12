"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = _interopRequireDefault(require("./routes/user.router"));

var _message = _interopRequireDefault(require("./routes/message.router"));

var _authenticationRouter = _interopRequireDefault(require("./routes/authenticationRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
app.use(_express.default.json()); // app.use('/api/v1/users', userRouters);

app.use('/api/v1/auth/', _authenticationRouter.default);
app.use('/api/v1/messages', _message.default);
var port = process.env.PORT || 6000;
var appServer = app.listen(port, console.log("App running on port ".concat(port)));
var _default = appServer;
exports.default = _default;