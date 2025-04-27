const express=require("express");
const router=express.Router({mergeParams:true});
const wrpasync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {listingSchema}=require("../Schema.js");
const listing=require("../models/listing.js");



const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};


//showing listings title
router.get("/", wrpasync(async(req,res)=>{
    const allListings= await listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

// new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//create  route
router.post("/",validateListing ,
    wrpasync(async (req,res,next)=>{
        const newlisting = new listing(req.body.listing);
        await newlisting.save();
        req.flash("success","new listing created!");
        res.redirect("/listings");
    })
   
);

//show route for particular id
router.get("/:id",wrpasync(async(req,res)=>{
    let {id}=req.params;
    const list = await listing.findById(id).populate("reviews");
    if(!list){
        req.flash("error","That listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}));

//edit route
router.get("/:id/edit",wrpasync(async (req,res)=>{
    let {id}=req.params;
    const list = await listing.findById(id);
    if(!list){
        req.flash("error","that listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});

}));

//update route
router.put("/:id",validateListing ,wrpasync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"please enter valid data for listing");
    }
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","new listing updated");
    res.redirect(`/listings/${id}`);

}));

//delete route
router.delete("/:id",wrpasync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","new listing deleted");
    res.redirect("/listings");

}));

module.exports=router;
