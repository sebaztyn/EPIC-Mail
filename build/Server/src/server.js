"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _yamljs = _interopRequireDefault(require("yamljs"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _message = _interopRequireDefault(require("./routes/message.router"));

var _authenticationRouter = _interopRequireDefault(require("./routes/authenticationRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swaggerDocument = _yamljs.default.load("".concat(__dirname, "/../../swagger.yaml"));

var app = (0, _express.default)();
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(swaggerDocument));
app.use(_express.default.json());
app.get('/', function (req, res) {
  res.send("Welcome to my EPIC Mail Endpoints' Page");
});
app.use('/api/v1/auth/', _authenticationRouter.default);
app.use('/api/v1/messages', _message.default);
var port = process.env.PORT || 3000;
var appServer = app.listen(port, console.log("App running on port ".concat(port)));
var _default = appServer;
exports.default = _default;