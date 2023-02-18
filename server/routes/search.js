const router = require('express').Router(),
youtubeSearchApi = require('youtube-search-api');


router.get('/', (req, res) => {
	const { keyword } = req.query;
	if (!keyword) {
		return res.status(400).send({ err: true, msg: 'No keyword provided' });
	}

	youtubeSearchApi
		.GetListByKeyword(keyword, true)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((err) => {
			res.status(400).send({ err: true, msg: 'something failed!' });
		});
});

module.exports = router;