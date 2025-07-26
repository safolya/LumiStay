const joi=require("joi");

const joilistingSchema=joi.object({
    list: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        country: joi.string().required(),
        location: joi.string().required(),
    }).required()
});

const reviewSchema=joi.object({
  review:joi.object({
  rate:joi.number().required().min(1).max(5),
  comment:joi.string().required(),  
  }).required()   
});

module.exports = {
    joilistingSchema, // Using shorthand for { joilistingSchema: joilistingSchema }
    reviewSchema      // Using shorthand for { reviewSchema: reviewSchema }
};