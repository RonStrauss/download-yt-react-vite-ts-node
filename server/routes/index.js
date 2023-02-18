const router = require('express').Router();

router.use('/search', require('./search'));
router.use('/download', require('./download').router);

module.exports = router;