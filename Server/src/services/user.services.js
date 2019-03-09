import allData from '../utils/allData';
import User from '../models/user.model';

const userServices = {


  findAllUser() {
    const userArr = allData.users;
    if (!userArr.length) {
      return;
    }
    return [...userArr];
  },

  addUsers(user) {
    const userArr = allData.users;
    const userLength = allData.users.length;
    const lastUserID = allData.users[userLength - 1].id;
    user.id = lastUserID + 1;
    userArr.push(user);
    return user;
  },

  findUser(id) {
    const userArr = allData.users;
    const searchedUser = userArr.find(user => user.id === id);
    return searchedUser;
  },

  deleteUser(id) {
    const userArr = allData.users;
    const userToDelete = userArr.find(user => user.id === id);
    return userToDelete;
  }
};


export default userServices;
