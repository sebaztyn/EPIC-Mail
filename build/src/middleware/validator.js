

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signupSchema = _joi.default.object().keys({
  firstName: _joi.default.string().required(),
  lastName: _joi.default.string().required(),
  password: _joi.default.string().min(8).max(255).required(),
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  recoveryEmail: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  username: _joi.default.string().regex(/^[0-9a-z]+$/i).min(3).required()
});

const loginSchema = _joi.default.object().keys({
  password: _joi.default.string().min(8).max(255).required(),
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

const passwordResetSchema = _joi.default.object().keys({
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

const newGroupMemberSchema = _joi.default.object().keys({
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

const newGroupSchema = _joi.default.object().keys({
  name: _joi.default.string().min(5).required()
});

const changeGroupNameSchema = _joi.default.object().keys({
  name: _joi.default.string().min(5).required()
});

const groupMessageSchema = _joi.default.object().keys({
  subject: _joi.default.string().required(),
  message: _joi.default.string().required()
});

const messageSchema = _joi.default.object().keys({
  message: _joi.default.string().required(),
  email: _joi.default.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  subject: _joi.default.string().required()
});

const errorMessage = function errorMessage(err, res) {
  return res.status(422).json({
    status: 422,
    error: err.details[0].message
  });
};

const validation = {
  signupValidator: function signupValidator(req, res, next) {
    const password = req.body.password;
    let email = req.body.email;
    email = email.toLowerCase();
    email = email.trim();
    req.body.email = email;
    const minMaxLength = /^[\s\S]{8,255}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharacterRegex = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

    if (minMaxLength.test(password) && uppercaseRegex.test(password) && lowercaseRegex.test(password) && numberRegex.test(password) && specialCharacterRegex.test(password)) {
      return _joi.default.validate(req.body, signupSchema, (err, value) => {
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
    const msgObj = {};
    const msgKeys = Object.keys(req.body);
    const msgField = Object.values(req.body);

    for (let i = 0; i < msgField.length; i++) {
      if (typeof msgField[i] === 'string') {
        msgObj[msgKeys[i]] = msgField[i].trim();
        req.body[msgKeys[i]] = msgObj[msgKeys[i]];
      }
    }

    return _joi.default.validate(msgObj, messageSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  loginValidator: function loginValidator(req, res, next) {
    const _req$body = req.body;


    let email = _req$body.email;


    let password = _req$body.password;
    email = email.toLowerCase();
    email = email.trim();
    password = password.trim();
    req.body.email = email;
    req.body.password = password;
    return _joi.default.validate(req.body, loginSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  passwordResetValidator: function passwordResetValidator(req, res, next) {
    let email = req.body.email;
    email = email.toLowerCase();
    email = email.trim();
    req.body.email = email;
    return _joi.default.validate(req.body, passwordResetSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  createNewGroup: function createNewGroup(req, res, next) {
    let name = req.body.name;
    name = name.trim();
    req.body.name = name;
    return _joi.default.validate(req.body, newGroupSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  groupMessageValidator: function groupMessageValidator(req, res, next) {
    const _req$body2 = req.body;


    let subject = _req$body2.subject;


    let message = _req$body2.message;
    subject = subject.trim();
    message = message.trim();
    req.body.subject = subject;
    req.body.message = message;
    return _joi.default.validate(req.body, groupMessageSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  addGroupUsers: function addGroupUsers(req, res, next) {
    let email = req.body.email;
    email = email.toLowerCase().trim();
    req.body.email = email;
    return _joi.default.validate(req.body, newGroupMemberSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  },
  changeGroupName: function changeGroupName(req, res, next) {
    let name = req.body.name;
    name = name.toLowerCase().trim();
    req.body.name = name;
    return _joi.default.validate(req.body, changeGroupNameSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }

      return next();
    });
  }
};
const _default = validation;
exports.default = _default;
