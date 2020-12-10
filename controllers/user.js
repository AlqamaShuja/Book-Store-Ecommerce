// const mongoose = require('mongoose');
mongoose = require('mongoose').set('debug', true);
const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

 

exports.read = (req, res) => {
    console.log("user controller: read = ", req.profile);
    req.profile.hashed_password = undefined;
    req.profile.salt= undefined;
    return res.status(200).json(req.profile);
}


exports.update = (req, res) => {
    User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
        if(err){
            return res.status(400).json({
                Error: "You are not authorized to perform this action"
            });
        }

        user.hashed_password = undefined;
        user.salt= undefined;
        return res.json(user);
    });
}


exports.userById = (req, res, next, id) => {
// mongoose.Types.ObjectId(id)
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: 'User Not Found'
            }); 
        }

        //if user found
        req.profile = user;
        next();
    });
}



exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach((item) => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    })

    User.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history }},
        { new: true, useFindAndModify: false}, 
        (error, data) => {
        if(error){
            return res.status(400).json({
                error: 'Could not update user purchase history.'
            });
        }
    });

    next();
}
 

exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id })
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            });
        }

        return res.json(orders);
    })
}