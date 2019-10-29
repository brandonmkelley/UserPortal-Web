var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/users', (req, res, next) => {
    console.log('accessed.')
    var firebase = req.app.get('firebase');
    
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then(result => {
            if (result) {
                console.log(result);
                res.end(JSON.stringify({ result: result }));
            }
        })
        .catch(function(error) {
            console.log(error);
            res.end(JSON.stringify({ error: error }));
        });
});

module.exports = router;
