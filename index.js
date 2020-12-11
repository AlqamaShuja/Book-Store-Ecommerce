const express = require('express');
require('dotenv').config();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const expressValidator = require("express-validator");
const path = require('path');

// const expressJWT = require('express-jwt'); 

//app
const app = express();

//
// app.use('/api', expressJWT( {secret: process.env.JWT_SECRET} ));

//import routes
const authRouter = require('./Routes/auth');
const userRouter = require('./Routes/user');
const categoryRouter = require('./Routes/category');
const productRouter = require('./Routes/product');
const braintreeRouter = require('./Routes/braintree');
const orderRouter = require('./Routes/order');



//DataBase
mongoose.connect(process.env.Mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error) => {
  if(error){
    return console.log("Unable to connect with Database");
  }
  console.log("DB Connection Established");
});




//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//Route Middleware
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', braintreeRouter);
app.use('/api', orderRouter);



// //route
// app.get('/', (req, res) => {
//     res.send("Hello from Node..")
// });




const port = process.env.PORT || 8000;


if(process.env.NODE_ENV == 'production'){
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
    console.log("Server is Running on port ", port);
})