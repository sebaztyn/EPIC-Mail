"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signupSchema = _joi.default.object().keys({
  firstName: _joi.default.string().required(),
  lastName: _joi.default.string().required(),
  password: _joi.default.string().min(8).max(255).required(),
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  recoveryEmail: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  username: _joi.default.string().regex(/^[0-9a-z]+$/i).min(3).required()
});

var loginSchema = _joi.default.object().keys({
  password: _joi.default.string().min(8).max(255).required(),
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

var passwordResetSchema = _joi.default.object().keys({
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

var newGroupMemberSchema = _joi.default.object().keys({
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

var newGroupSchema = _joi.default.object().keys({
  name: _joi.default.string().min(5).required()
});

var changeGroupNameSchema = _joi.default.object().keys({
  name: _joi.default.string().min(5).required()
});

var groupMessageSchema = _joi.default.object().keys({
  subject: _joi.default.string().required(),
  message: _joi.default.string().required()
});

var messageSchema = _joi.default.object().keys({
  message: _joi.default.string().required(),
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  subject: _joi.default.string().required()
});

var errorMessage = function errorMessage(err, res) {
  return res.status(422).json({
    status: 422,
    error: err.details[0].message
  });
};

var validation = {
  signupValidator: function signupValidator(req, res, next) {
    var password = req.body.password;
    var email = req.body.email;
    email = email.toLowerCase();
    email = email.trim();
    req.body.email = email;
    var minMaxLength = /^[\s\S]{8,255}$/;
    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var numberRegex = /[0-9]/;
    var specialCharacterRegex = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

    if (minMaxLength.test(password) && uppercaseRegex.test(password) && lowercaseRegex.test(password) && numberRegex.test(password) && specialCharacterRegex.test(password)) {
      return _joi.default.validate(req.body, signupSchema, function (err, value) {
        if (err) {
          return errorMessage(err, res);
        }

        return next();
      });
    }

    return res.status(422).json({
      status: 422,
      error: 'Check password length and values. Ensure your password contains One uppercase, one lowercase, one number, one special character. Password length must also be at least 8 characters long'
    });
  },
  createMessageValidator: function createMessageValidator(req, res, next) {
    var msgObj = {};
    var msgKeys = Object.keys(req.body);
    var msgField = Object.values(req.body);

    for (var i = 0; i < msgField.length; i++) {
      if (typeof msgField[i] === 'string') {
        msgObj[msgKeys[i]] = msgField[i].trim();
        req.body[msgKeys[i]] = msgObj[msgKeys[i]];
      }
    }

    return _joi.default.validate(msgObj, messageSchema, function (err, value) {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  loginValidator: function loginValidator(req, res, next) {
    var _req$body = req.body,
        email = _req$body.email,
        password = _req$body.password;
    email = email.toLowerCase();
    email = email.trim();
    password = password.trim();
    req.body.email = email;
    req.body.password = password;
    return _joi.default.validate(req.body, loginSchema, function (err, value) {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  passwordResetValidator: function passwordResetValidator(req, res, next) {
    var email = req.body.email;
    email = email.toLowerCase();
    email = email.trim();
    req.body.email = email;
    return _joi.default.validate(req.body, passwordResetSchema, function (err, value) {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  createNewGroup: function createNewGroup(req, res, next) {
    var name = req.body.name;
    name = name.trim();
    req.body.name = name;
    return _joi.default.validate(req.body, newGroupSchema, function (err, value) {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  groupMessageValidator: function groupMessageValidator(req, res, next) {
    var _req$body2 = req.body,
        subject = _req$body2.subject,
        message = _req$body2.message;
    subject = subject.trim();
    message = message.trim();
    req.body.subject = subject;
    req.body.message = message;
    return _joi.default.validate(req.body, groupMessageSchema, function (err, value) {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  addGroupUsers: function addGroupUsers(req, res, next) {
    var email = req.body.email;
    email = email.trim();
    req.body.email = email;
    return _joi.default.validate(req.body, newGroupMemberSchema, function (err, value) {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  changeGroupName: function changeGroupName(req, res, next) {
    var name = req.body.name;
    name = name.trim();
    name = name.toLowerCase();
    req.body.name = name;
    return _joi.default.validate(req.body, changeGroupNameSchema, function (err, value) {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  }
};
var _default = validation;
exports.default = _default;