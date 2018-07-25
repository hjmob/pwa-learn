var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',version:1 });
});

router.get('/message', function(req, res, next) {
  res.render('message', { title: 'message' });
});

module.exports = router;
