const joi=require("joi");

module.exports= listingSchema=joi.object({
    list: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        country: joi.string().required(),
        image: joi.object({
            url: joi.string().allow('', null) // Allow empty string or null for URL
        }).allow(null),
        location: joi.string().required(),
    }).required()
});