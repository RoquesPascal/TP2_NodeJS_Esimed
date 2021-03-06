const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const app = express();
const port = 3000;
const {users} = require("../models/db");
const guard = require('express-jwt-permissions')({
    permissionsProperty: 'roles',
});

const adminRole = 'ADMIN';
const adminOrMemberRoles = [[adminRole], ['MEMBER']];



router.get('/', guard.check(adminOrMemberRoles), (req, res) => {
    res.send(userRepository.getUsers())
});

router.get('/:firstName', guard.check(adminOrMemberRoles), (req, res) => {
    const foundUser = userRepository.getUserByFirstName(req.params.firstName);

    if (!foundUser) {
      throw new Error('User not found');
    }

    res.send(foundUser);
});

router.post('/create-example-users', (req, res) => {
    userRepository.createExampleUsers();
    res.status(201).end();
});

router.post('/', guard.check(adminRole), (req, res) => {
    userRepository.createUser(req.body);
    res.status(201).end();
});

router.put('/update/:id', guard.check(adminRole), (req, res) => {
    userRepository.updateUser(req.params.id, req.body);
    res.status(204).end();
});

router.delete('/delete/:id', guard.check(adminRole), (req, res) => {
    userRepository.deleteUser(req.params.id);
    res.status(204).end();
});

router.post('/login', (req, res) => {
    const token = userRepository.getJWT(req.body);
    if(token !== null)
    {
        res.send(token)
        res.status(200).end();
    }
    else
    {
        res.status(401).end();
    }
});

exports.initializeRoutes = () => {
    return router;
}
