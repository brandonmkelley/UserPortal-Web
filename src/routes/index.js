var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('template', {
        title: 'Express',
        user: req.app.get('firebase').auth().currentUser,
        contentPath: './',
        contentName: 'index'
    });
});

module.exports = router;
