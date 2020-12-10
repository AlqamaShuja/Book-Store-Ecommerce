const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();


// const gateway = braintree.connect({
//     //as we are working in sandbox environment
//     environment: braintree.Environment.Sandbox,
//     merchantId: process.env.BRAINTREE_MERCHANT_ID,
//     publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//     privateKey: process.env.BRAINTREE_PRIVATE_KEY
// })
const gateway = new braintree.BraintreeGateway({
    //as we are working in sandbox environment
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

exports.generateToken = (req, res) => {
    //use GateWay to generate token
    gateway.clientToken.generate({}, (error, response) => {
        if(error){
            res.status(500).send(error);
        }else{
            res.send(response);
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    //charge the user
    let newTransaction = gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (error, result) => {
        if(error){
            res.status(500).json(error);
        }
        else{
            res.json(result);
        }
    });
}