const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().min(6).required(),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required().pattern(/^[0-9]+$/).min(10).max(12),
    address: Joi.string().min(6).max(255),
    dob: Joi.date().max("now"),
    sex: Joi.string().valid('male', 'female', 'other').required(),
    weight: Joi.number().optional(),
    height: Joi.number().optional(),
    avatar: Joi.string().optional(),
    activityLevel: Joi.string().valid('low', 'moderate', 'high').optional(),
    goal: Joi.string().valid('weight_loss', 'maintenance', 'muscle_gain').optional(),
});

exports.validateSignup = validator(signupSchema);
