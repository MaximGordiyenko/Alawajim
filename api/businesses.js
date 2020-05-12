export const router = require('express').Router();
import Business from "../model/businesses";
import Photo from "../model/photos";
import Review from "../model/reviews";

router.get('/', function (req, res) {
  let {page} = parseInt(req.body);
  const numPerPage = 10;

  if (page != null || page !== undefined) {
    return Business.find({}, function (err, doc) {
      if (err) {
        return res.send(err);
      }
      const lastPage = Math.ceil(doc.length / numPerPage);
      page = page < lastPage ? page : lastPage

      const start = (page - 1) * numPerPage;
      const end = Math.floor(start + numPerPage);
      const pageBusinesses = doc.slice(start, end);

      const links = {};
      if (page < lastPage) {
        links.nextPage = `/businesses?page=${page + 1}`;
        links.lastPage = `/businesses?page=${lastPage}`;
      }
      if (page > 1) {
        links.prevPage = `/businesses?page=${page - 1}`;
        links.firstPage = '/businesses?page=1';
      }

      let pageID = pageBusinesses.map(e => parseInt(e.id));
      return Business.find({_id: pageID}, function (err, onePage) {
        if (err) {
          return res.send(err);
        }
        return res.send({
          businesses: onePage,
          pageNumber: page,
          totalPages: lastPage,
          pageSize: numPerPage,
          totalCount: doc.length,
          links: links
        });
      });
    });
  }
});

router.post('/', function (req, res) {
  const {id, ownerid, name, address, city, state, zip, phone, category, subcategory, website, email} = req.body;
  const business = {
    _id: id || null,
    ownerid: ownerid || null,
    name: name || 'unknown',
    address: address || 'unknown',
    city: city || 'unknown',
    state: state || 'unknown',
    zip: zip || 'unknown',
    phone: phone || 'unknown',
    category: category || 'unknown',
    subcategory: subcategory || 'unknown',
    website: website || 'unknown',
    email: email || 'unknown',
  };

  return Business.find({_id: id, ownerid: ownerid}, function (err, doc) {
    if (doc.length > 0) {
      return res.status(409).send(`Conflict: the ${doc.length} document with id: ${id} is exist in DB`);
    }
    return Business.create(business, function (err, doc) {
      if (err) {
        return res.status(404).send(err);
      }
      return res.send({message: `Document with id: ${id} was added in DB`, document: doc});
    });
  });
});

router.get('/:businessid', async function (req, res) {
  const requestedBusnessId = parseInt(req.params.businessid);

  let responseObject = {};
  responseObject.reviews = await Business.find({businessid: requestedBusnessId}).populate('review');
  console.log(responseObject);
  return res.send(responseObject);
  // responseObject.photos = await Photo.find({businessid: requestedBusnessId});
  // responseObject.reviews = await Review.find({businessid: requestedBusnessId});
  // responseObject.business = await Business.findOne({_id: requestedBusnessId});
  // return res.send(responseObject);
});

router.put('/:businessid', function (req, res) {
  const businessid = parseInt(req.params.businessid);
  const {ownerid, name, address, city, state, zip, phone, category, subcategory, website, email} = req.body;

  const updateBusinesses = {
    ownerid: ownerid || null,
    name: name || 'unknown',
    address: address || 'unknown',
    city: city || 'unknown',
    state: state || 'unknown',
    zip: zip || 'unknown',
    phone: phone || 'unknown',
    category: category || 'unknown',
    subcategory: subcategory || 'unknown',
    website: website || 'unknown',
    email: email || 'unknown'
  };

  return Business.findByIdAndUpdate(businessid, updateBusinesses, {new: true}, function (err, doc) {
    if (err) {
      return res.status(500).send(err)
    }
    return res.status(200).send({
      message: `Document with ${businessid} was updated`,
      links: { business: `/businesses/${businessid}`},
      document: doc
    });
  });
});

router.delete('/:businessid', function (req, res) {
  const businessid = parseInt(req.params.businessid);
  console.log("businessid", businessid);
  return Business.findByIdAndDelete({_id: businessid}, function (err, doc) {
    if (!doc || err) {
      return res.status(500).send(err);
    }
    return res.status(200).send({
      message: `Document with ${businessid} was deleted`,
      documents: doc,
    });
  });
});
