const express = require('express');
const { DateTime } = require('luxon');
const cors = require('cors');
const app = express();
const jwt = require("jsonwebtoken");
const jwtExpress = require('express-jwt');
const {getJWT} = require("../models/user-repository");
const {request} = require("express");



const initJsonHandlerMiddlware = (app) => app.use(express.json());

const initCorsMiddlware = (app) => app.use(cors());

const initLoggerMiddlware = (app) => {
    app.use((req, res, next) => {
        const begin = new DateTime(new Date());

        res.on('finish', () => {
            const requestDate = begin.toString();
            const remoteIP = `IP: ${req.connection.remoteAddress}`;
            const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

            const end = new DateTime(new Date());
            const requestDurationMs = end.diff(begin).toMillis();
            const requestDuration = `Duration: ${requestDurationMs}ms`;

            console.log(`[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`);
        })
        next();
    });
};

const initJwtMiddleware = (app) => {
    app.use(jwtExpress({ secret: 'privateKey', algorithms: ['HS256']}).unless({path : ['/users/login', '/users/create-example-users']}));
};

exports.initializeConfigMiddlewares = (app) => {
    initJsonHandlerMiddlware(app);
    initCorsMiddlware(app);
    initLoggerMiddlware(app);
    initJwtMiddleware(app);
}

exports.initializeErrorMiddlwares = (app) => {
    app.use((err, req, res, next) => {
        res.status(500).send(err.message);
    });
}
