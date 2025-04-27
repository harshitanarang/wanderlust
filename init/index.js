const mongoose=require("mongoose");
const initData=require("./data.js");
//const listing= require("../models/listing.js");
const listing=require("../models/listing.js");



//mongo connection function
main().then(()=>{
    console.log("database connected sucessfully");
})
.catch((err)=>{
    console.log(err);
});


//mongoose connect
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initdb= async()=> {
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("initialized");

};

initdb();

