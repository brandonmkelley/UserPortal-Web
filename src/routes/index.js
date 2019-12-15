var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var firebase = req.app.get('firebase');
    var firebaseApp = req.app.get('firebaseApp-' + req.sessionId);
    
    res.render('template', {
        title: 'Express',
        user: (firebaseApp) ? firebase.auth(firebaseApp).currentUser : null,
        contentPath: './',
        contentName: 'index'
    });
});

module.exports = router;
