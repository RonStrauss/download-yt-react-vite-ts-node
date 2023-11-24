const path = require('path');
const router = require('express').Router();
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const readline = require('readline');
const root = require('../constants').root;
const fs = require('fs');
const { jsonSet } = require('./search');
const e = require('express');

router.get('/', (req, res) => {
	const { id, name } = req.query;

	if (!id) {
		return res.status(400).send({ err: true, msg: 'No id provided' });
	}

	downloadMP3({ id, name });

	res.send({ msg: 'Video downloading!' });
});

module.exports = { router, writeVideoDetailJson, downloadMP3 };

function downloadMP3({ id, name }) {
	let stream = ytdl(id, {
		quality: 'highestaudio',
	});

	let start = Date.now();

	if (!name) {
		ytdl
			.getBasicInfo(id)
			.then((info) => {
				const videoTitle = info.player_response.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

				handleDownloadAndWrite({ stream, videoTitle, start, id });

				writeVideoDetailJson({ id, videoTitle, videoDetails: info.player_response.videoDetails });
			})
			.catch((err) => {
				console.log(err);
			});
		return;
	}

	handleDownloadAndWrite({ stream, name, start, id });
}

function handleDownloadAndWrite({ stream, videoTitle, start, id }) {
	ffmpeg(stream)
		.audioBitrate(128)
		.save(path.join(root, 'downloaded', 'mp3s', `${id} - ${videoTitle}.mp3`))
		.on('progress', (p) => {
			readline.cursorTo(process.stdout, 0);
			process.stdout.write(`${p.targetSize}kb downloaded`);
		})
		.on('end', () => {
			jsonSet.add(id);
			console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
			process.emit('download-finished', JSON.stringify({ name: videoTitle, id }));
		});
}

function writeVideoDetailJson({ id, videoTitle, videoDetails }) {
	const saveLocation = path.join(root, 'downloaded', 'jsons', `${id} - ${videoTitle}.json`);
	fs.writeFile(saveLocation, JSON.stringify(videoDetails, null, 4), 'utf8', function (err) {
		if (err) {
			console.log('An error occurred while writing JSON Object to File.');
			return console.log(err);
		}

		console.log('JSON file has been saved.');
	});
}

