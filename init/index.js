const mongoose=require("mongoose");
const initdb=require("../init/data");
const db=require("../config/mongoose-connection");
const listingModel=require("../models/listing");

 const initidb=async ()=>{
    await listingModel.insertMany(initdb.data);
    console.log("data initialized");
};
initidb();