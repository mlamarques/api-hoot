const express = require('express')
require('dotenv').config()
// require('./database/mongoConfig')
require('./database/mongoConfigTesting')
const cors = require('cors');
var helmet = require('helmet');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const mongoose = require('mongoose')

const userRouter = require('./routes/routes');

// const mongoDB = process.env.MONGODB_URI
// mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true })
// const db = mongoose.connection
// db.on('error', console.error.bind(console, "mongo connection error"))

// const User = mongoose.model(
//     "User",
//     new Schema({
//         username: { type: String, required: true },
//         password: { type: String, required: true },
//         createdAt: { type: Date, required: true },
//         updatedAt: { type: Date, required: true }
//     })
// );

const app = express();
app.use(cors())
app.use(helmet());

// app.use(session({ secret: process.env.SECRET_ENV, resave: false, saveUninitialized: true }))  
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', userRouter);

module.exports = app

// const port = process.env.PORT || 3000

// app.listen(port, () => console.log(`app listening on port ${port}!`));

// // app.get('/', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../hoot-app/build/index.html'));
// // })


// app.post('/signup', (req, res, next) => {
//     // res.json({msg: `${req.body.username}`})
//     bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
//         if (err) return next(err)
        
//         const user = new User({
//             username: req.body.username,
//             password: hashedPassword,
//             createdAt: req.body.createdAt,
//             updatedAt: req.body.updatedAt
//           }).save(err => {
//             if (err) { 
//               return next(err);
//             } else {
//                 res.json({message: "sign up complete"})
//             }
//         });
//     })
    
// })
// app.post('/usercheck', function(req, res) {
//     console.log(req.body)
//     User.findOne({username: req.body.username}, function(err, user){
//         if(err) {
//           console.log(err);
//         }
//         if(user) {
//             return res.status(200).json({message: "User found", isFound: true})
//         } else {
//             return res.json({message: "User not found", isFound: false, status: 403})
//         }
//     });
// });
// app.post('/login', function(req, res) {
//     User.findOne({ username: req.body.username}, (err, user) => {
//         if (err) { 
//             console.log(err);
//         }
//         bcrypt.compare(req.body.password, user.password, (err, result) => {
//             if (err) {console.log(err);}
//             if (result) {
//               // passwords match! log user in
//               jwt.sign({ username: user.username }, process.env.SECRET_ENV, { expiresIn: '24h'}, (err, token) => {
//                 res.json({ message: "Auth Passed", token: token, match: true })
//                 // res.redirect('http://localhost:3000/home').end()
//               })
//             } else {
//               // passwords do not match!
//               return res.json({message: "Incorrect password", match: false})
//             }
//         })
//         // if (user.password !== req.body.password) {
//         //     message = "password doesn't exist";
//         //     console.log(message)
//         //     return res.sendStatus(401)
//         // } else {
//         //     message = "password exists";
//         //     console.log(message)
//         //     return res.sendStatus(200)
//         // }
//       })
// })
// app.post('/session', function(req, res, next) {
//     const token = req.body.session
//     jwt.verify(token, process.env.SECRET_ENV, (err, authData) => {
//         if (err) {
//             res.json({tokenMatch: false})
//         } else {
//             res.json({tokenMatch: true, authData, token})
//         }
//     })
// })

// // function verifyToken(req, res, next) {
// //     // Get auth header value

// //     // const bearerHeader = req.headers['Authorization']
// //     // if (typeof bearerHeader !== undefined) {
// //     //     const bearerToken = bearerHeader.split(' ')[1]
// //     // } else {
// //     //     res.sendStatus(403)
// //     // }
// //     res.json({token: req.body})
// //     next()
// // }
