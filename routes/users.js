var express = require('express');
var router = express.Router();
var model = require('../models/user')
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

router
  .post('/', (req, res) => {
    req.body.password = passwordHash.generate(req.body.password)
    model.collection.insertOne(req.body)
      .then((data)=>{
        res.json(data)
      }).catch((err)=>{
        res.status(500).json(err);
    })
  })
  .post('/login', (req, res) => {
    model.findOne({ username: req.body.username}).sort('-dateAdded').exec((err, item) => {
        if (err) {
          res.status(500).json(err);
        }
        // res.json(item)
        if (item ) {
            if (passwordHash.verify(req.body.password, item.password)) {
                
                let token = jwt.sign({
                    item
                  }, 'ODJWT1010', { expiresIn: '24h' });
                res.json(token)
            } else {
                res.status(401).json({msg: 'Incorrect password'})
            }
        } else {
            res.status(404).json({msg: 'Username is not existed'})
        }
      });
  })
module.exports = router;