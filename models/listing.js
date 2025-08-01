const { ref } = require("joi");
const mongoose=require("mongoose");
const reviewModel=require("./reviews");

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description: {
      type:String,
    },
    image:{
      url: String,
      filename: String, // Assuming you want to store the filename as well
    },
    category: {
      type: String,
      enum: ['Trending', 'Iconic Cities', 'Mountains', 'Amazing Pools', 'Camping', 'Arctic', 'Castle', 'Rooms', 'Dome', 'Farm'],
      required: true
    },
    country:String,
    location:String,
    price:Number,
    reviews:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"review"
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
     await reviewModel.deleteMany({_id: {$in: listing.reviews}});
  }
})

module.exports=mongoose.model("listing",listingSchema);

// image:{
//       url: {
//         type: String,
//         default:"https://images.unsplash.com/photo-1748367959778-12d026a20a99?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         set: (v)=> v === ""? "https://images.unsplash.com/photo-1748367959778-12d026a20a99?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
//       } ,
//     },