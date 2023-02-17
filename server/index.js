// imports / constants
const fs = require('fs'),
	youtubeSearchApi = require('youtube-search-api'),
	app = require('express')(),
	cors = require('cors'),
	PORT = process.env.PORT || 1000,
	ytdl = require('ytdl-core'),
	ffmpeg = require('fluent-ffmpeg'),
	readline = require('readline');

// file operations
fs.mkdirSync('./downloaded', { recursive: true });

// app / server
app.use(cors());

app.get('/search', (req, res) => {
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

app.get('/download', (req, res) => {
	const { id, name } = req.query;

	if (!id) {
		return res.status(400).send({ err: true, msg: 'No id provided' });
	}

	downloadMP3(id, name);

	res.send({ msg: 'video downloading, check server for info' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});


// functions
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
		.save(`${__dirname}/downloaded/${videoTitle}.mp3`)
		.on('progress', (p) => {
			readline.cursorTo(process.stdout, 0);
			process.stdout.write(`${p.targetSize}kb downloaded`);
		})
		.on('end', () => {
			console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
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
