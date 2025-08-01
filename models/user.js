const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    profileImage: {
        url: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        },
        filename: String
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);