const mongoose=require("mongoose");
const initdb=require("../init/data");
const db=require("../config/mongoose-connection");
const listingModel=require("../models/listing");

 const initidb=async ()=>{
    await listingModel.deleteMany({});
    console.log("data deleted");
    initdb.data=initdb.data.map((obj)=>({
        ...obj,owner:"68733ce6c84f294c09f45250"
    }));
    await listingModel.insertMany(initdb.data);
    console.log("data initialized");
};
initidb();