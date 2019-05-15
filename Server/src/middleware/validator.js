import Joi from 'joi';
import { serverResponse } from '../helper/serverResponse';

const signupSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().min(8).max(255).required(),
  email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  recoveryEmail: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  username: Joi.string().regex(/^[0-9a-z]+$/i).min(3).required()
});

const loginSchema = Joi.object().keys({
  password: Joi.string().min(8).max(255)
    .required(),
  email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

const passwordResetSchema = Joi.object().keys({
  email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

const newGroupMemberSchema = Joi.object().keys({
  email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required()
});

const newGroupSchema = Joi.object().keys({
  name: Joi.string().min(5).required()
});
const changeGroupNameSchema = Joi.object().keys({
  name: Joi.string().min(5).required()
});

const groupMessageSchema = Joi.object().keys({
  subject: Joi.string().required(),
  message: Joi.string().required()
});

const messageSchema = Joi.object().keys({
  message: Joi.string().required(),
  email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required(),
  subject: Joi.string().required()
});

const errorMessage = (err, res) => {
  const errMessage = err.details[0].message;
  return serverResponse(res, 422, 'status', 'error', errMessage);
};

const validation = {
  signupValidator(req, res, next) {
    const { password } = req.body;
    let { email } = req.body;
    email = email.toLowerCase().trim();
    req.body.email = email;
    const minMaxLength = /^[\s\S]{8,255}$/; const uppercaseRegex = /[A-Z]/; const lowercaseRegex = /[a-z]/; const numberRegex = /[0-9]/; const
      specialCharacterRegex = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

    if (minMaxLength.test(password) && uppercaseRegex.test(password) && lowercaseRegex.test(password) && numberRegex.test(password) && specialCharacterRegex.test(password)) {
      return Joi.validate(req.body, signupSchema, (err, value) => {
        if (err) {
          return errorMessage(err, res);
        }
        return next();
      });
    }
    return serverResponse(res, 422, 'status', 'error', 'Check password length and values. Ensure your password contains One uppercase, one lowercase, one number, one special character. Password length must also be at least 8 characters long');
  },

  createMessageValidator(req, res, next) {
    const msgObj = {};
    const msgKeys = Object.keys(req.body);
    const msgField = Object.values(req.body);
    for (let i = 0; i < msgField.length; i++) {
      if (typeof msgField[i] === 'string') {
        msgObj[msgKeys[i]] = msgField[i].trim();
        req.body[msgKeys[i]] = msgObj[msgKeys[i]];
      }
    }
    return Joi.validate(msgObj, messageSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }
      return next();
    });
  },

  loginValidator(req, res, next) {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    password = password.trim();
    req.body.email = email;
    req.body.password = password;
    return Joi.validate(req.body, loginSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }
      return next();
    });
  },

  passwordResetValidator(req, res, next) {
    let { email } = req.body;
    email = email.toLowerCase().trim();
    req.body.email = email;
    return Joi.validate(req.body, passwordResetSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }
      return next();
    });
  },

  createNewGroup(req, res, next) {
    let { name } = req.body;
    name = name.toLowerCase().trim();
    req.body.name = name;
    return Joi.validate(req.body, newGroupSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }
      return next();
    });
  },
  groupMessageValidator(req, res, next) {
    let { subject, message } = req.body;
    subject = subject.trim();
    message = message.trim();
    req.body.subject = subject;
    req.body.message = message;
    return Joi.validate(req.body, groupMessageSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }
      return next();
    });
  },
  addGroupUsers(req, res, next) {
    let { email } = req.body;
    email = email.toLowerCase().trim();
    req.body.email = email;
    return Joi.validate(req.body, newGroupMemberSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }
      return next();
    });
  },
  changeGroupName(req, res, next) {
    let { name } = req.body;
    name = name.toLowerCase().trim();
    req.body.name = name;
    return Joi.validate(req.body, changeGroupNameSchema, (err, value) => {
      if (err) {
        return errorMessage(err, res);
      }
      return next();
    });
  }
};

export default validation;
