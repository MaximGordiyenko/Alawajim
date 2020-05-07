const router = require('express').Router();
const validation = require('../lib/validation');
import Photo from "../model/photos";

const photos = require('../data/photos');

exports.router = router;
exports.photos = photos;

/*
 * Schema describing required/optional fields of a photo object.
 */
const photoSchema = {
  userid: {required: true},
  businessid: {required: true},
  caption: {required: false}
};


/*
 * Route to create a new photo.
 */
router.post('/', function (req, res, next) {
  const {id, userid, businessid, caption} = req.body;
  console.log(id, userid, businessid, caption);

  const photo = {
    _id: id || null,
    userid: userid || null,
    businessid: businessid || null,
    caption: caption || "unknown"
  };

  return Photo.find({_id: id, userid: userid, businessid: businessid}, function (err, doc) {
    if (doc.length > 0) {
      return res.status(409).send(`Conflict: the ${doc.length} document exist in DB`);
    }
    return Photo.create(photo, function (err, photo) {
      if (err) {
        return res.status(404).send(err);
      }
      return res.send({
        id: id,
        links: {
          photo: `/photos/${id}`,
          business: `/businesses/${businessid}`
        }
      })
    });
    // if (validation.validateAgainstSchema(req.body, photoSchema)) {
    //   const photo = validation.extractValidFields(req.body, photoSchema);
    //   photo.id = photos.length;
    //   photos.push(photo);
    //   res.status(201).json({
    //     id: photo.id,
    //     links: {
    //       photo: `/photos/${photo.id}`,
    //       business: `/businesses/${photo.businessid}`
    //     }
    //   });
    // } else {
    //   res.status(400).json({
    //     error: "Request body is not a valid photo object"
    //   });
    // }
  });
});
/*
 * Route to fetch info about a specific photo.
 */
router.get('/:photoID', function (req, res, next) {
  const photoID = parseInt(req.params.photoID);
  if (photos[photoID]) {
    res.status(200).json(photos[photoID]);
  } else {
    next();
  }
});

/*
 * Route to update a photo.
 */
router.put('/:photoID', function (req, res, next) {
  const photoID = parseInt(req.params.photoID);
  const {userid, businessid, caption} = req.body;
  console.log(userid, businessid, caption);

  const update_photo = {
    userid: userid,
    businessid: businessid,
    caption: caption,
  }
  return Photo.findByIdAndUpdate(photoID, update_photo, {new: true}, function (err, doc) {
    if (err) {
      return res.send(err)
    }
    return res.send({
      links: {
        photo: `/photos/${photoID}`,
        business: `/businesses/${businessid}`
      },
      update_photo: doc,
    });
  });

  // if (photos[photoID]) {
  //
  //   if (validation.validateAgainstSchema(req.body, photoSchema)) {
  //     /*
  //      * Make sure the updated photo has the same businessid and userid as
  //      * the existing photo.
  //      */
  //     const updatedPhoto = validation.extractValidFields(req.body, photoSchema);
  //     const existingPhoto = photos[photoID];
  //     if (existingPhoto && updatedPhoto.businessid === existingPhoto.businessid && updatedPhoto.userid === existingPhoto.userid) {
  //       photos[photoID] = updatedPhoto;
  //       photos[photoID].id = photoID;
  //       res.status(200).json({
  //         links: {
  //           photo: `/photos/${photoID}`,
  //           business: `/businesses/${updatedPhoto.businessid}`
  //         }
  //       });
  //     } else {
  //       res.status(403).json({
  //         error: "Updated photo cannot modify businessid or userid"
  //       });
  //     }
  //   } else {
  //     res.status(400).json({
  //       error: "Request body is not a valid photo object"
  //     });
  //   }
  //
  // } else {
  //   next();
  // }
});

/*
 * Route to delete a photo.
 */
router.delete('/:photoID', function (req, res, next) {
  const photoID = parseInt(req.params.photoID);

  return Photo.findByIdAndDelete({_id: photoID}, function (err, doc) {
    if (!doc || err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(doc);
  });
  // if (photos[photoID]) {
  //   photos[photoID] = null;
  //   res.status(204).end();
  // } else {
  //   next();
  // }
});
