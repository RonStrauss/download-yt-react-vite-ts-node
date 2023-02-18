const router = require('express').Router(),
	ytdl = require('ytdl-core'),
	ffmpeg = require('fluent-ffmpeg'),
	readline = require('readline'),
    root = require('../constants').root,
	fs = require('fs');

router.get('/', (req, res) => {
	const { id, name } = req.query;

	if (!id) {
		return res.status(400).send({ err: true, msg: 'No id provided' });
	}

	downloadMP3(id, name);

	res.send({ msg: 'Video downloading!' });
});

module.exports = {router};

function downloadMP3(id, name) {
	let stream = ytdl(id, {
		quality: 'highestaudio',
	});

	let start = Date.now();

	if (!name) {
		ytdl.getBasicInfo(id).then((info) => {
			const videoTitle = info.player_response.videoDetails.title;

			handleDownloadAndWrite(stream, videoTitle, start);

			writeVideoDetailJson(id, videoTitle, info.player_response.videoDetails);
		});
		return;
	}

	handleDownloadAndWrite(stream, name, start);
}

function handleDownloadAndWrite(stream, videoTitle, start) {
	ffmpeg(stream)
		.audioBitrate(128)
		.save(`${root}/downloaded/${videoTitle}.mp3`)
		.on('progress', (p) => {
			readline.cursorTo(process.stdout, 0);
			process.stdout.write(`${p.targetSize}kb downloaded`);
		})
		.on('end', () => {
			console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
			process.emit('download-finished', videoTitle)
		});
}

function writeVideoDetailJson(id, videoTitle, videoDetails) {
	fs.writeFile(`./downloaded/${id} - ${videoTitle} - info.json`, JSON.stringify(videoDetails, null, 4), 'utf8', function (err) {
		if (err) {
			console.log('An error occurred while writing JSON Object to File.');
			return console.log(err);
		}

		console.log('JSON file has been saved.');
	});
}
