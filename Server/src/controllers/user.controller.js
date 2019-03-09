/* eslint-disable no-plusplus */

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import user from '../models/user.model';

dotenv.config();

const userControllers = {
  findAllUsers(req, res) {
    const data = user.findAllUsers();

    return res.status(200).json({ status: 200, data });
  },
  findOneUser(req, res) {
    const userID = Number(req.params.id);

    const userToSearch = user.findUser(userID);

    if (!userToSearch) {
      return res.status(404).json({
        status: 404,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      status: 200,
      data: userToSearch
    });
  },

  deleteUser(req, res) {
    const userID = Number(req.params.id);
    const usersArr = user.findAllUsers();
    const userToDelete = usersArr.find(eachUser => eachUser.id === userID);
    if (userToDelete !== 1) {
      const deletedUser = usersArr.splice(userToDelete, 1);
      res.json({
        status: 200,
        data: deletedUser
      });
      return res.json({
        status: 401,
        error: 'There is no such user in database'
      });
    }
  }


};

export default userControllers;
