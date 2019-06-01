"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _authControl = _interopRequireDefault(require("../controller/authControl"));

var _validator = _interopRequireDefault(require("../middleware/validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
router.post('/signup', _validator.default.signupValidator, _authControl.default.addUser);
router.post('/login', _validator.default.loginValidator, _authControl.default.login);
router.post('/reset', _validator.default.passwordResetValidator, _authControl.default.passwordreset);
var _default = router;
exports.default = _default;