const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { update } = require('../models/product');
// const { filter } = require('lodash');


exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.status(200).json(req.product);
}


exports.create = (req, res) => {
    const form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded."
            });
        }

        // console.log(fields);

        const { name, description, price, category, quantity, shipping } = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = new Product(fields);

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image size must be less than 1 MB"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save()
        .then(prod => {
            res.status(201).json({ prod })
        })
        .catch(err => {
            res.status(400).json({
                error: err.message,
            });
        });
    });
}


exports.remove = (req, res) => {
    const product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(404).json({
                error: errorHandler(err)
            });
        }
        return res.status(200).json({
            message: "Delete Product Successfully",
            product: deletedProduct
        });
    });
//     Product.deleteOne(req.product._id).exec((err, prod) => {
//         if(err){
//             return res.status(404).json({
//                 error: "Product with the given id was not found"
//             });
//         }
//         return res.status(200).json({
//             message: "Deleted Successfully",
//             product: prod
//         });
//     });
}


exports.updateProduct = (req, res) => {
    const form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded."
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "Image size must be less than 1 MB"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save()
        .then(prod => {
            return res.status(204).json({prod});
        })
        .catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        });
    });
}


exports.list =(req, res) => {
    const order = req.query.order ? req.query.order : 'asc';
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;

    Product.find().select("-photo").populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, prod)=> {        
                if(err){
                    return res.status(400).json({
                        Error: "Product Not Found"
                    });
                }

                return res.json(prod);
        });
}



exports.listRelated = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    Product.find({ _id: {$ne: req.product._id }, category: req.product.category })
    .select("-photo")
    .populate('category', '_id name')
    .exec((err, prod) => {
        if(err){
            return res.status(404).json({
                error: "Product Not Found"
            });
        }
        return res.json(prod);
    });
}



exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .exec((err, prod)=> {
        if(err || !prod){
            return res.status(404).json({
                error: "Product with the given Id was not found."
            });
        }
        req.product = prod;
        next();
    });
}


exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for(let key in req.body.filters){
        console.log("key: ", key);
        if(req.body.filters[key].length > 0){
            if(key === 'price'){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs).select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, products) => {
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            return res.json({
                size: products.length,
                products
            });
        });
}


exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
}


exports.listSearch = (req, res) => {
    //create query object to hold search value and category value
    const query = {}
    //assign search value to query.name
    if(req.query.search){
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }
        //assign category value to query.category
        if(req.query.category && req.query.category !== 'All'){
            query.category = req.query.category
        }
        console.log(query);
        //find the product based on query object with 2 properties (search and category)
        Product.find(query)
        .select('-photo')
        .exec((err, products) => {
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            return res.json(products);
        });
    }
}


exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return{
            updateOne: {
                filter: { _id: item._id },
                update: { 
                    $inc: { 
                        quantity: -item.count,
                        sold: +item.count 
                    }
                }
            }
        }; 
    });

    //bulkWrite takes three args 1) bulkOpt  2) empty obj  3) callback
    Product.bulkWrite(bulkOps, {}, (error, data) => {
        if(error){
            console.log("Error at decreaseQuantity: ", error);
        }
    });
    // .then((data) => {
    //     return res.json(data);
    // })
    // .catch(err => ( res.json({ error: err })));

    next();
}