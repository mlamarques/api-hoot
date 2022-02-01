require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, "mongo connection error"))