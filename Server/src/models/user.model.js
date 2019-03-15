import allData from '../utils/allData';

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

    const userLength = this.usersList.length;
    const lastUserID = this.usersList[userLength - 1].id;
    user.id = lastUserID + 1;

    const newUser = {
      id: user.id,
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
}

export default new User();
