require('dotenv').config()
const User = require('../models/user');
const jwt = require('jsonwebtoken');        //to generate signed token
const expressJWT = require('express-jwt');  //for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    const user = new User(req.body);
    
    user.save().then(() => {
        user.salt = undefined
        user.hashed_password = undefined
        return res.send({ user });
    })
    .catch((err) => {
        return res.status(400).send({ err: errorHandler(err) });
    });
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if(!user){
                return res.status(400).json({ error: "User with given email does not found. Please SignUp" });
            }
            //if user found then make sure that password is matched
            //create autheticate method in user model
            if(!user.authenticate(password)){
                return res.status(401).json({ error: "Email and Password does not match."});
            }

            //generate a signed token with user id and secret
            const token = jwt.sign(user.id, process.env.JWT_SECRET);

            //persist the token as 't' in cookie with expiry date
            res.cookie('t', token, { expire: new Date() + 9999});
            
            //return response with user and token to frontend client
            const { _id, name, email, role } = user;
            res.json({ token, user: { _id, name, email, role }});
        })
        .catch(err => {
            res.status(400).json({
                err: "User with given email does not found. Please SignUp"
            });
        })
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: "Successfully Signout"});
}


exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ['HS256']
});


exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth == req.profile._id;
    if(!user){
        return res.status(403).json({
            error: "Access denied"
        });
    }

    next();
}

//Checking for admin
exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "Access denied, Only admin can access."
        })
    }
    next();
}

















