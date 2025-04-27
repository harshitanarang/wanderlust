const express = require("express");
const router = express.Router({ mergeParams: true});
const wrpasync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema } = require("../Schema.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

//post review route new review create
router.post(
  "/",
  validateReview,
  wrpasync(async (req, res) => {
    let m = await listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    m.reviews.push(newreview);
    await newreview.save();
    await m.save();
    req.flash("success", "new review created");
    res.redirect(`/listings/${m._id}`);
  })
);

//delete review route
router.delete(
  "/:reviewId",
  wrpasync(async (req, res) => {
    let { id, reviewId } = req.params;
    id = id.trim();
    reviewId = reviewId.trim();
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", " review deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
