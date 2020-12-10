const {Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.create = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
}


exports.listOrder = (req, res) => {
    Order.find()
    .populate('user', '_id name address')
    .sort('-created')
    .exec((error, data) => {
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        return res.json(data);
    })
}


exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues)
}



exports.orderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
        if(err || !order){
            return res.status(400).json({
                error: errorHandler(err) 
            });
        }

        //if order found
        req.order = order;
    });
    next();
}


exports.updateOrderStatus = (req, res) => {
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status }}, (err, order) => {
        if(err || !order){
            return res.status(400).json({
                error: errorHandler(err) 
            });
        }
        
        res.json(order);
    });

}