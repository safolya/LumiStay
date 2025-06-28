const mongoose=require("mongoose");

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description: {
      type:String,
    },
    image:{
      url: {
        type: String,
        default:"https://images.unsplash.com/photo-1748367959778-12d026a20a99?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v)=> v === ""? "https://images.unsplash.com/photo-1748367959778-12d026a20a99?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
      } ,
    },
    country:String,
    location:String,
    price:Number
});

module.exports=mongoose.model("listing",listingSchema);