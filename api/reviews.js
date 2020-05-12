export const router = require('express').Router();
import Review from "../model/reviews";

router.post('/', function (req, res) {
  const {id, userid, businessid, dollars, stars, review} = req.body;

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
        return res.status(500).send(err);
      }
      return res.status(200).send({
        message: `Document with id: ${id} was created`,
        links: {
          review: `/reviews/${id}`,
          business: `/businesses/${businessid}`
        },
        document: view,
      });
    });
  });
});

router.get('/:reviewID', function (req, res) {
  const reviewID = parseInt(req.params.reviewID);

  return Review.find({_id: reviewID}, function (err, doc) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(doc);
  });
});

router.put('/:reviewID', function (req, res) {
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
      return res.status(500).send(err)
    }
    return res.status(200).send({
      message: `Document with id: ${reviewID} was updated`,
      links: {
        review: `/reviews/${reviewID}`,
        business: `/businesses/${businessid}`
      },
      document: doc,
    });
  });
});

router.delete('/:reviewID', function (req, res) {
  const reviewID = parseInt(req.params.reviewID);

  return Review.findByIdAndDelete({_id: reviewID}, function (err, doc) {
    if (err) {
      return res.status(500).send(err)
    }
    return res.status(200).send({delete: doc})
  });
});
