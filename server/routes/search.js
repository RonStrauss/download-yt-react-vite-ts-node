const router = require('express').Router(),
youtubeSearchApi = require('youtube-search-api');

const fs = require('fs');
const path = require('path');
const downloadedDir = path.join(__dirname, '..','downloaded');
const downloadedMp3sDir = fs.readdirSync(path.join(downloadedDir, 'mp3s'));
const downloadedJsonsDir = fs.readdirSync(path.join(downloadedDir, 'jsons'));
const jsonSet = new Set(downloadedJsonsDir.map((file) => file.split(' - ')[0]));


router.get('/', (req, res) => {
	const { keyword } = req.query;
	if (!keyword) {
		return res.status(400).send({ err: true, msg: 'No keyword provided' });
	}

	youtubeSearchApi
		.GetListByKeyword(keyword, true)
		.then((result) => {
			result.items = result.items.map((item) => ({...item, downloaded: jsonSet.has(item.id)}));
			res.status(200).send(result);
		})
		.catch((err) => {
			console.error(err);
			res.status(400).send({ err: true, msg: 'something failed!' });
		});
});

module.exports = router;