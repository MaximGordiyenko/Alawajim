const router = require('express').Router();
const validation = require('../lib/validation');

// const businesses = require('../data/businesses');
const {reviews} = require('./reviews');
const {photos} = require('./photos');

exports.router = router;
// exports.businesses = businesses;
import Business from "../model/businesses";

/*
 * Schema describing required/optional fields of a business object.
 */
const businessSchema = {
  ownerid: {required: true},
  name: {required: true},
  address: {required: true},
  city: {required: true},
  state: {required: true},
  zip: {required: true},
  phone: {required: true},
  category: {required: true},
  subcategory: {required: true},
  website: {required: false},
  email: {required: false}
};

router.get('/', function (req, res) {
  let page = parseInt(req.query.page) || 1;
  const numPerPage = 10;

  if (page != null || page !== undefined) {
    return Business.find({}, function (err, doc) {
      if (err) {
        return res.send(err);
      }
      const lastPage = Math.ceil(doc.length / numPerPage);
      console.log('last page:', lastPage);
      console.log('doc length:', doc.length);

      page = page < lastPage ? page : lastPage

      const start = (page - 1) * numPerPage;
      console.log('start:', start);
      const end = Math.floor(start + numPerPage);
      console.log('end:', end);

      const pageBusinesses = doc.slice(start, end); //0-10, 10-20
      console.log('pageBusinesses:', pageBusinesses);
      let pageID = pageBusinesses.map(e => parseInt(e.id));
      console.log("pageID:", pageID);

      const links = {};
      if (page < lastPage) {
        links.nextPage = `/businesses?page=${page + 1}`;
        links.lastPage = `/businesses?page=${lastPage}`;
      }
      if (page > 1) {
        links.prevPage = `/businesses?page=${page - 1}`;
        links.firstPage = '/businesses?page=1';
      }

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
        })
      })
    })
  }
});

/*
 * Route to create a new business.
 */
router.post('/', function (req, res, next) {
  const {id, ownerid, name, address, city, state, zip, phone, category, subcategory, website, email} = req.body;
  console.log(id, ownerid, name, address, city, state, zip, phone, category, subcategory, website, email);

  const business = {
    _id: id,
    ownerid: ownerid || 'unknown',
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

  return Business.find({_id: id, ownerid: ownerid, name: name, phone: phone}, function (err, doc) {
    if (doc.length > 0) {
      return res.status(409).send(`Conflict: the ${doc.length} document exist in DB`);
    }
    return Business.create(business, function (err, doc) {
      if (err) {
        return res.status(404).send(err);
      }
      return res.send(doc);
    })
  })

  /*if (validation.validateAgainstSchema(req.body, businessSchema)) {
   const business = validation.extractValidFields(req.body, businessSchema);
   business.id = businesses.length;
   businesses.push(business);
   res.status(201).json({
   id: business.id,
   links: {
   business: `/businesses/${business.id}`
   }
   });
   } else {
   res.status(400).json({
   error: "Request body is not a valid business object"
   });
   }*/
});

/*
 * Route to fetch info about a specific business.
 */
router.get('/:businessid', function (req, res, next) {
  const businessid = parseInt(req.params.businessid);
  if (businesses[businessid]) {
    /*
     * Find all reviews and photos for the specified business and create a
     * new object containing all of the business data, including reviews and
     * photos.
     */
    const business = {
      reviews: reviews.filter(review => review && review.businessid === businessid),
      photos: photos.filter(photo => photo && photo.businessid === businessid)
    };
    Object.assign(business, businesses[businessid]);
    res.status(200).json(business);
  } else {
    next();
  }
});

/*
 * Route to replace data for a business.
 */
router.put('/:businessid', function (req, res, next) {
  const businessid = parseInt(req.params.businessid);
  if (businesses[businessid]) {

    if (validation.validateAgainstSchema(req.body, businessSchema)) {
      businesses[businessid] = validation.extractValidFields(req.body, businessSchema);
      businesses[businessid].id = businessid;
      res.status(200).json({
        links: {
          business: `/businesses/${businessid}`
        }
      });
    } else {
      res.status(400).json({
        error: "Request body is not a valid business object"
      });
    }

  } else {
    next();
  }
});

/*
 * Route to delete a business.
 */
router.delete('/:businessid', function (req, res, next) {
  const businessid = parseInt(req.params.businessid);
  if (businesses[businessid]) {
    businesses[businessid] = null;
    res.status(204).end();
  } else {
    next();
  }
});
