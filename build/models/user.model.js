"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _allData = _interopRequireDefault(require("../utils/allData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var idGenerator = function () {
  var id = 2;

  function inner() {
    id += 1;
    return id;
  }

  return inner;
}();

var User =
/*#__PURE__*/
function () {
  function User() {
    _classCallCheck(this, User);

    this.usersList = _allData.default.users;
  }

  _createClass(User, [{
    key: "findAllUsers",
    value: function findAllUsers() {
      return this.usersList;
    }
  }, {
    key: "addUser",
    value: function addUser(user) {
      var email = user.email,
          firstName = user.firstName,
          lastName = user.lastName,
          password = user.password,
          username = user.username,
          recoveryEmail = user.recoveryEmail;
      var newUser = {
        id: idGenerator(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        username: username,
        recoveryEmail: recoveryEmail
      };
      this.usersList.push(newUser);
      return {
        id: newUser.id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        username: username,
        recoveryEmail: recoveryEmail
      };
    }
  }, {
    key: "findUser",
    value: function findUser(id) {
      var userArr = this.usersList;
      var searchedUser = userArr.find(function (user) {
        return user.id === id;
      });
      return searchedUser;
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(id) {
      var userArr = this.usersList;
      var userToDelete = userArr.find(function (user) {
        return user.id === id;
      });
      return userToDelete;
    }
  }]);

  return User;
}();

var _default = new User();

exports.default = _default;