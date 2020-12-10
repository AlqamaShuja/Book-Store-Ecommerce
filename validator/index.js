exports.userSignUpValidator = (req, res, next) => {
    req.check('name', 'Name is required and between 3 to 30 character.').notEmpty().isLength({ min: 4, max: 30 });
    req.check('email', 'Email must be required..').matches(/.+\@.+\..+/).withMessage("Please Provide a valid Email");
    req.check('password', 'Password is required').notEmpty()
    req.check('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
        .matches(/\d/).withMessage("Password must contain atleast one digit");

    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    next()
}