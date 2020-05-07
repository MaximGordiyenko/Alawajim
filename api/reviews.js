const router = require('express').Router();
const validation = require('../lib/validation');
import Review from "../model/reviews";

const reviews = require('../data/reviews');
exports.router = router;
exports.reviews = reviews;

/*
 * Schema describing required/optional fields of a review object.
 */
const reviewSchema = {
  userid: {required: true},
  businessid: {required: true},
  dollars: {required: true},
  stars: {required: true},
  review: {required: false}
};


/*
 * Route to create a new review.
 */
router.post('/', function (req, res, next) {
  const {id, userid, businessid, dollars, stars, review} = req.body;
  console.log(id, userid, businessid, dollars, stars, review);

  const re_view = {
    _id: id || null,
    userid: userid || null,
    businessid: businessid || null,
    dollars: dollars || null,
    stars: stars || null,
    review: review || 'unknown',
  };

  return Review.find({_id: id, userid: userid, businessid: businessid}, function (err, doc) {
    if (doc.length > 0) {
      return res.status(409).send(`Conflict: the ${doc.length} document exist in DB`);
    }
    return Review.create(re_view, function (err, view) {
      if (err) {
        return res.send(err);
      }
      return res.send({
        id: id,
        links: {
          review: `/reviews/${id}`,
          business: `/businesses/${businessid}`
        }
      });
    })
  })

  // if (validation.validateAgainstSchema(req.body, reviewSchema)) {
  //
  //   const review = validation.extractValidFields(req.body, reviewSchema);
  //
  //   /*
  //    * Make sure the user is not trying to review the same business twice.
  //    */
  //   const userReviewedThisBusinessAlready = reviews.some(
  //     existingReview => existingReview
  //       && existingReview.ownerid === review.ownerid
  //       && existingReview.businessid === review.businessid
  //   );
  //
  //   if (userReviewedThisBusinessAlready) {
  //     res.status(403).json({
  //       error: "User has already posted a review of this business"
  //     });
  //   } else {
  //     review.id = reviews.length;
  //     console.log('review.id', review.id);
  //     reviews.push(review);
  //     console.log("reviews", reviews);
  //     res.status(201).json({
  //       id: review.id,
  //       links: {
  //         review: `/reviews/${review.id}`,
  //         business: `/businesses/${review.businessid}`
  //       }
  //     });
  //   }
  //
  // } else {
  //   res.status(400).json({
  //     error: "Request body is not a valid review object"
  //   });
  // }
});

/*
 * Route to fetch info about a specific review.
 */
router.get('/:reviewID', function (req, res, next) {
  const reviewID = parseInt(req.params.reviewID);
  console.log('reviewID', reviewID);

  return Review.find({_id: reviewID}, function (err, doc) {
    if (err) {
      return res.send(err)
    }
    return res.send(doc)
  })
  // if (reviews[reviewID]) {
  //   res.status(200).json(reviews[reviewID]);
  // } else {
  //   next();
  // }
});

/*
 * Route to update a review.
 */
router.put('/:reviewID', function (req, res, next) {
  const reviewID = parseInt(req.params.reviewID);
  const {userid, businessid, dollars, stars, review} = req.body;

  const update_review = {
    userid: userid || null,
    businessid: businessid || null,
    dollars: dollars || null,
    stars: stars || null,
    review: review || 'unknown'
  };
  return Review.findByIdAndUpdate(reviewID, update_review, {new: true}, function (err, doc) {
    if (err) {
      return res.send(err)
    }
    return res.send({
      links: {
        review: `/reviews/${reviewID}`,
        business: `/businesses/${businessid}`
      }
    })
  });
  // if (reviews[reviewID]) {
  //
  //   if (validation.validateAgainstSchema(req.body, reviewSchema)) {
  //     /*
  //      * Make sure the updated review has the same businessid and userid as
  //      * the existing review.
  //      */
  //     let updatedReview = validation.extractValidFields(req.body, reviewSchema);
  //     let existingReview = reviews[reviewID];
  //     if (updatedReview.businessid === existingReview.businessid && updatedReview.userid === existingReview.userid) {
  //       reviews[reviewID] = updatedReview;
  //       reviews[reviewID].id = reviewID;
  //       res.status(200).json({
  //         links: {
  //           review: `/reviews/${reviewID}`,
  //           business: `/businesses/${updatedReview.businessid}`
  //         }
  //       });
  //     } else {
  //       res.status(403).json({
  //         error: "Updated review cannot modify businessid or userid"
  //       });
  //     }
  //   } else {
  //     res.status(400).json({
  //       error: "Request body is not a valid review object"
  //     });
  //   }
  //
  // } else {
  //   next();
  // }
});

/*
 * Route to delete a review.
 */
router.delete('/:reviewID', function (req, res, next) {
  const reviewID = parseInt(req.params.reviewID);

  return Review.findByIdAndDelete({_id: reviewID}, function (err, doc) {
    if (err) {
      return res.send(err)
    }
    return res.send({delete: doc})
  })
  // if (reviews[reviewID]) {
  //   reviews[reviewID] = null;
  //   res.status(204).end();
  // } else {
  //   next();
  // }
});
