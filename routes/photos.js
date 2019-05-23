var express = require('express');
var router = express.Router();
var model = require('../models/photo')
var multer   =  require( 'multer' );
var moment = require('moment');
var Jimp = require('jimp');
var config = require('../public/configuration.json')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/static/images/galleries')
  },
  filename: function (req, file, cb) {
    cb(null, moment().format('YYYY-MM-DD') +"-"+file.originalname);
  }
})

var upload   =  multer( {storage: storage} );
var sizeOf   =  require( 'image-size' );


require( 'string.prototype.startswith' );
router
  .get('/', (req, res) => {
    var where = {}
    var limit = config.photo_limit
    var page = req.query.page ? req.query.page : 1
    if (req.query.homepage == 1) {
      where = {
        homepage: 1
      }
      limit = config.photo_homepage
    }
    // console.log(limit)
    model.find(where).sort('-dateAdded').limit(parseInt(limit)).skip((page - 1) * limit).exec((err, items) => {
      if (err) {
        res.status(500).send(err);
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
  .get('/:id', (req, res) => {
    if (req.params.id != 0) {
      model.findById( req.params.id).sort('-dateAdded').exec((err, item) => {
        if (err) {
          res.status(500).send(err);
        }
        res.json({ item });
      })
    } else {
      res.status(200).json({mesg: 'no'})
    }
  })
  .post('/', (req, res) => {
    let Newuser = {
      "name": req.body.name,
      "homepage": req.body.homepage,
      "state": 1,
      "full": req.body.full,
      "thumbnail": req.body.thumbnail
    }
    model.collection.insertOne(Newuser)
      .then((data)=>{
        res.json(data)
      }).catch((err)=>{
        res.status(500).json(err);
    })
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
    let thumbnail = req.file.destination + '/thumb/'+moment().format('YYYY-MM-DD') +"-"+req.file.originalname
    Jimp.read(req.file.destination + '/' + req.file.filename, (err, img) => {
      if (err) throw err;
      img
        .resize(300, Jimp.AUTO) // resize
        .quality(100) // set JPEG quality
        // .greyscale() // set greyscale
        .write(thumbnail); // save
    });
    let folder = '/images/galleries/'
    return res.status( 200 ).json( {
      thumbnail: folder+ 'thumb/'+moment().format('YYYY-MM-DD') +"-"+req.file.originalname,
      full: folder+req.file.filename,
  
      original: req.file.originalname,
    } );
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