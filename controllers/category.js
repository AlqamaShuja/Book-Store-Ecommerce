const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save()
        .then(cat => {
            if(!cat){
                res.status(400).json({
                    error: "Please provide a valid category."
                });
            }

            return res.status(200).json({
                category: cat
            });
            
        }).catch(err => {
            res.status(400).json({
                error: errorHandler(err)
            });
        });
}


exports.read = (req, res) => {
    return res.status(200).json(req.category);
}


exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save()
        .then(cat => {
            if(!cat){
                res.status(400).json({
                    error: "Please provide a valid category."
                });
            }

            return res.status(200).json({
                category: cat
            });
            
        }).catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        });
}


exports.deleteCat = (req, res) => {
    const category = req.category;
    category.remove()
        .then(cat => {
            return res.status(200).json({
                Message: "Category Removed Successfully"
            });
            
        }).catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        });
}


exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        return res.status(200).json(data);
    });
}


exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, categ) => {
        if(err || !categ){
            return res.status(400).json("Category does not exist");
        }
        req.category = categ;
        next();
    });
}