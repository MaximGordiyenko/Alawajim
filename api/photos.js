export const router = require('express').Router();
const mongoose = require('mongoose');
import Photo from "../model/photos";

router.post('/', function (req, res) {
  const {id, userid, businessid, caption} = req.body;

  const photo = {
    userid: userid || null,
    businessid: businessid || null,
    caption: caption || "unknown"
  };

  return Photo.find({businessid: businessid}, function (err, doc) {
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
        },
        document: photo
      });
    });
  });
});

router.get('/:photoID', function (req, res) {
  const photoID = parseInt(req.params.photoID);

  return Photo.find({businessid: photoID}, function (err, photo) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(photo);
  });
});


router.put('/:photoID', function (req, res) {
  const photoID = parseInt(req.params.photoID);
  const {userid, businessid, caption} = req.body;

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
});

router.delete('/:photoID', function (req, res) {
  const photoID = parseInt(req.params.photoID);

  return Photo.findByIdAndDelete({_id: photoID}, function (err, doc) {
    if (!doc || err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(doc);
  });
});