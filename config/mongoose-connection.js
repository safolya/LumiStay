const mongoose=require("mongoose");

// const MONGO_URL="mongodb://127.0.0.1:27017/LumiStay";
const dburl=process.env.ATLASDB_URL;

main().then( ()=>{
    console.log("conected.db");
} ).catch(err=>{
    console.log(err.message);
})


async function main() {
    await mongoose.connect(dburl);
};

module.exports=mongoose.connection;