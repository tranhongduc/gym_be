const { validateSignup } = require('../validations/signup.validation.js');
const { validateSignin } = require('../validations/signin.validation.js');

const validationMiddlewares = {
    signup: async (req, res, next) => {
        console.log(req.body);
        
        const { error } = validateSignup(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },

    signin: async (req, res, next) => {
        const { error } = validateSignin(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
}

module.exports = validationMiddlewares;
