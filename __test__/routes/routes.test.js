require('dotenv').config()
const initializeMongoServer = require('../../database/mongoConfigTesting')
const User = require('../../models/user');

const index = require("../../index");
const userController = require('../../controllers/userController');
const userRouter = require('../../routes/routes');
const jwt = require('jsonwebtoken')

const request = require("supertest");
const express = require("express");
const app = express();

const token = jwt.sign({ username: 'jon' }, process.env.SECRET_ENV, { expiresIn: '24h'})

app.use(express.urlencoded({ extended: false }));
// app.use("/", index);
app.use('/', userRouter);

beforeAll(() => {
    initializeMongoServer()
    return new Promise(resolve => {
        const user = new User({
            username: 'jon',
            password: '$2b$10$8PnQ3c1/X7yF9DfeUqljduOy8cSIQnHDmTSWX3KvV5XPEh8wpMsEC',
            createdAt: "2022-02-10T19:46:37.719Z",
            updatedAt: "2022-02-10T19:46:37.719Z"
        })
        const user2 = new User({
            username: 'maria',
            password: '$2b$10$17fMyHFEpHzV7G/auHRueumO46RE0rqEVWwQ8wEFM2w1m672ikrWC',
            createdAt: "2022-02-10T19:46:37.719Z",
            updatedAt: "2022-02-10T19:46:37.719Z"
        })
        user.save();
        user2.save();
        resolve();
    });
});

test("TEst GET", done => {
    request(app)
        .get("/test")
          .expect(200, {
            message: "ok"
          }, done);
});

test("TEst POST", done => {
    request(app)
        .post("/test")
        .type('form')
        .send({
            id: 'some fixed id',
            name: 'john'
          })
        .expect(200, {
        message: "ok"
        }, done);
});

test("TEst GET name", done => {
    request(app)
        .get("/usercheck")
        .expect(200, done);
});

test("Usercheck Jon", done => {
    request(app)
      .post("/usercheck")
      .type('form')
      .send({ username: 'maria' })
      .expect({
        message: "User found", 
        isFound: true
      }, done);
});

test("Usercheck Maria", done => {
    request(app)
      .post("/usercheck")
      .type('form')
      .send({ username: 'maria' })
      .expect({
        message: "User found", 
        isFound: true
      }, done);
});

test("Password check", done => {
    request(app)
      .post("/login")
      .type('form')
      .send({
          username: 'jon',
          password: 'password'
        })
      .expect({
          message: "Auth Passed",
          token: token,
          match: true
      }, done);
});