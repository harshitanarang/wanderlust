const mongoose=require("mongoose");
const Review=require("./review.js");
const review = require("./review.js");
const {Schema}=mongoose;

const listingSchema=new Schema({
    title:{
        type: String,
        required:true
    },
    description: String,

    image: {
        type: String,
    },

    price: Number,
    location: String,
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:Review
    }]
});

    //     default:
    //       "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //     set: (v) =>
    //       v === ""
    //         ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //         : v,
    //   },

    // image: {
    //     type: imageSchema,
    //     required: true,
    // },   
    
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});

    }
    

});


      
const listing= mongoose.model("listing",listingSchema);

module.exports=listing;
