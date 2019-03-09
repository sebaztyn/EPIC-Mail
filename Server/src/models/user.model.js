import allData from '../utils/allData';

const idGenerator = (() => {
  let id = 2;

  function inner() {
    id += 1;
    return id;
  }

  return inner;
})();

class User {
  constructor() {
    this.usersList = allData.users;
  }

  findAllUsers() {
    return this.usersList;
  }

  addUser(user) {
    const {
      email, firstName, lastName, password, username, recoveryEmail
    } = user;

    const newUser = {
      id: idGenerator(),
      email,
      firstName,
      lastName,
      password,
      username,
      recoveryEmail
    };

    this.usersList.push(newUser);

    return {
      id: newUser.id,
      email,
      firstName,
      lastName,
      username,
      recoveryEmail
    };
  }

  findUser(id) {
    const userArr = this.usersList;
    const searchedUser = userArr.find(user => user.id === id);
    return searchedUser;
  }

  deleteUser(id) {
    const userArr = this.usersList;
    const userToDelete = userArr.find(user => user.id === id);
    return userToDelete;
  }
}

export default new User();
