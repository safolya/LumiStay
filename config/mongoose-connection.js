const mongoose=require("mongoose");

const MONGO_URL="mongodb://127.0.0.1:27017/LumiStay";

main().then( ()=>{
    console.log("conected.db");
} ).catch(err=>{
    console.log(err.message);
})


async function main() {
    await mongoose.connect(MONGO_URL);
};

module.exports=mongoose.connection;