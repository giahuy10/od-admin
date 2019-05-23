var express = require('express');
var router = express.Router();
var model = require('../models/event')
var slug = require('slug')
var multer   =  require( 'multer' );
var moment = require('moment');
var Jimp = require('jimp');
var config = require('../public/configuration.json')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/static/images/events')
  },
  filename: function (req, file, cb) {
    cb(null, moment().format('YYYY-MM-DD') +"-"+file.originalname);
  }
})

var upload   =  multer( {storage: storage} );
var sizeOf   =  require( 'image-size' );
router
  .get('/', (req, res) => {
    var where = {state : 1}
    var limit = config.event_limit
    var page = parseInt(req.query.page) > 1 ? parseInt(req.query.page) : 1
    if (req.query.homepage == 1) {
      where = {
        state: 1,
        homepage: 1
      }
      limit = config.event_homepage
    }
    console.log(req.query)
    model.find(where).sort('-dateAdded').limit(parseInt(limit)).skip((page - 1) * limit).exec((err, items) => {
      if (err) {
        res.status(500).json(err);
      }
      model.count(where).exec((err, count) => {
        res.json({
          items,
          pagination: {
            pagesCurrent: page,
            offset: limit,
            limit,
            pagesStart: (page - 1) * limit + 1,
            pagesStop: page * limit < count ? page * limit : count,
            pagesTotal: Math.ceil(count / limit),
            count,
            from: (page - 1) * limit + 1,
            to: page * limit < count ? page * limit : count
          },
        })
      })
    });
  })
  .get('/:slug', (req, res) => {
    model.findOne({ slug: req.params.slug}).sort('-dateAdded').exec((err, item) => {
      if (err) {
        res.status(500).json(err);
      }
      res.json({ item });
    });
  })
  .post('/', (req, res) => {
    req.body.dateAdded = moment().format('YYYY-MM-DD')
    req.body.slug = slug(req.body.title_en)
    model.collection.save(req.body)
      .then((data)=>{
        res.json(req.body.slug)
      }).catch((err)=>{
        res.status(500).json(err);
    })
  })
  .put('/:id', (req, res) => {
    model.findByIdAndUpdate(
    // the id of the item to find
      req.params.id,
      
      // the change to be made. Mongoose will smartly combine your existing 
      // document with this change, which allows for partial updates too
      req.body,
      
      // an option that asks mongoose to return the updated version 
      // of the document instead of the pre-updated one.
      {new: true},
      
      // the callback function
      (err, todo) => {
      // Handle any possible database errors
          if (err) return res.status(500).json(err);
          return res.json(todo);
      }
    ) 
  })
  .post( '/upload', upload.single( 'file' ), function( req, res, next ) {
    
    if ( !req.file.mimetype.startsWith( 'image/' ) ) {
      return res.status( 422 ).json( {
        error : 'The uploaded file must be an image'
      } );
    }

    var dimensions = sizeOf( req.file.path );

    if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
      return res.status( 422 ).json( {
        error : 'The image must be at least 640 x 480px'
      } );
    }
    let folder = '/images/events/'
    if (req.query.editor) {
      return res.status( 200 ).json( {location: folder+req.file.filename})
    } else {
      let thumbnail = req.file.destination + '/thumb-'+moment().format('YYYY-MM-DD') +"-"+req.file.originalname
      Jimp.read(req.file.destination + '/' + req.file.filename, (err, img) => {
        if (err) throw err;
        img
          .resize(350, 495) // resize
          .quality(100) // set JPEG quality
          // .greyscale() // set greyscale
          .write(thumbnail); // save
      });
      
      return res.status( 200 ).json( {
        thumbnail: folder+ 'thumb-'+moment().format('YYYY-MM-DD') +"-"+req.file.originalname,
        full: folder+req.file.filename,
    
        original: req.file.originalname,
      } );
    }
    
  })
  .delete('/:_id', (req, res) => {
    model.findByIdAndRemove(req.params._id, (err, model) => {
      // As always, handle any potential errors:
      if (err) return res.status(500).json(err);
      // We'll create a simple object to send back with a message and the id of the document that was removed
      // You can really do this however you want, though.
      const response = {
          message: "Item successfully deleted",
          id: model._id
      };
      return res.status(200).json(response);
    })
  })

module.exports = router;