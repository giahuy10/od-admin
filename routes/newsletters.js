var express = require('express');
var router = express.Router();
var model = require('../models/newsletter')

router
  .get('/', (req, res) => {
    model.find().sort('-dateAdded').exec((err, items) => {
      if (err) {
        res.status(500).json(err);
      }
      res.json({ items });
    });
  })
  .get('/:id', (req, res) => {
    model.findById(req.params).sort('-dateAdded').exec((err, item) => {
      if (err) {
        res.status(500).json(err);
      }
      res.json({ item });
    });
  })
  .post('/', (req, res) => {
    model.collection.insertOne(req.body)
      .then((data)=>{
        res.json(data)
      }).catch((err)=>{
        res.status(500).json(err);
    })
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