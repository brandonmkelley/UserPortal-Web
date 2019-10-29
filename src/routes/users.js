
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res, next) => {
    console.log(req.body);
    var firebase = req.app.get('firebase');
    
    
});

module.exports = router;
