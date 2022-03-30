const { users } = require('./db');
const md5 = require('md5');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const {response} = require("express");
const salt = bcrypt.genSaltSync(12);
const jwt = require('jsonwebtoken');
const {sign} = require("jsonwebtoken");

const Roles_Admin  = "ADMIN";
const Roles_Member = "MEMBER";



exports.createExampleUsers = () => {
    users.push({id        : uuid.v4(),
                firstName : "Pascal",
                lastName  : "Roques",
                password  : bcrypt.hashSync("1234", salt),
                roles     : [Roles_Admin]});

    users.push({id        : uuid.v4(),
                firstName : "Jean",
                lastName  : "Neymar",
                password  : bcrypt.hashSync("5678"),
                roles     : [Roles_Member]});

    users.push({id        : uuid.v4(),
                firstName : "Martin",
                lastName  : "Martin",
                password  : bcrypt.hashSync("0000"),
                roles     : [Roles_Member]});
};

exports.createUser = (data) => {
    const user = {
        id: uuid.v4(),
        firstName: data.firstName,
        lastName: data.lastName,
        password: bcrypt.hashSync(data.password),
        roles: [Roles_Member]
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

exports.getJWT = (body) => {
    const user = exports.getUserByFirstName(body.firstName);

    if((user !== null) && (bcrypt.compareSync(body.password, user.password)))
        return sign(user, 'privateKey', {expiresIn : "1h"});
    else
        return null;
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