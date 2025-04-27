
//requirements
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");
const review=require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require('express-session');
const flash=require("connect-flash");

//settings
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const SessionOptions={
    secret:'mysupersecretcode',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    },
    
};
//root route
app.get("/",(req,res)=>{
    res.send("working root");
});

app.use(session(SessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();

})

//error handling for mongoose
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
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



//error handling
app.all("*" ,(req,res,next)=>{
    next(new ExpressError(404,"page not found"));

});

//error handling
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{message});
    // res.status(statusCode).send(message);
});

//port runnning
app.listen(8081,()=>{
    console.log("success");
});