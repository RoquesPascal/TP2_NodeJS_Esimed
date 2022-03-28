const { users } = require('./db');
const md5 = require('md5');
const uuid = require('uuid');
const bcrypt = require('./node_modules/bcryptjs');
const salt = 12;



exports.createExampleUsers = () => {
  users.push({id        : uuid.v4(),
              firstName : "Pascal",
              lastName  : "Roques",
              password  : md5("1234")});

  users.push({id        : uuid.v4(),
              firstName : "Jean",
              lastName  : "Neymar",
              password  : md5("5678")});

  users.push({id        : uuid.v4(),
              firstName : "Martin",
              lastName  : "Martin",
              password  : md5("0000")});
};

exports.createUser = (data) => {
  const user = {
    id: uuid.v4(),
    firstName: data.firstName,
    lastName: data.lastName,
    password: md5(data.password),
  };

  users.push(user);
};

exports.deleteUser = (id) => {
  const userIndex = users.findIndex((user) => user.id == id);

  if (userIndex === -1) {
    throw new Error('User not foud');
  }

  users.splice(userIndex, 1);
};

exports.getUserByFirstName = (firstName) => {
    const foundUser = users.find((user) => user.firstName == firstName);

    if (!foundUser) {
        throw new Error('User not found');
    }

    return foundUser;
};

exports.getUsers = () => {
    return users;
};

exports.updateUser = (id, data) => {
    const foundUser = users.find((user) => user.id == id);

    if (!foundUser) {
        throw new Error('User not found');
    }

    foundUser.firstName = data.firstName || foundUser.firstName;
    foundUser.lastName = data.lastName || foundUser.lastName;
    foundUser.password = data.password ? md5(data.password) : foundUser.password;
};