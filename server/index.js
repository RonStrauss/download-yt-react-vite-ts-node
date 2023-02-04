const fs = require('fs'),
	YoutubeMp3Downloader = require('youtube-mp3-downloader'),
	youtubeSearchApi = require('youtube-search-api'),
	express = require('express'),
	app = express(),
	cors = require('cors'),
	PORT = 1000;

app.use(cors());
fs.mkdirSync('./downloaded', { recursive: true });

app.get('/search', (req, res) => {
	const { keyword } = req.query;
	if (!keyword) {
		return res.status(400).send({ err: true, msg: 'No keyword provided' });
	}

	youtubeSearchApi.GetListByKeyword(keyword, true).then((result) => {
		res.status(200).send(result);
	});
});

app.get('/download', (req, res) => {
	const { id } = req.query;
	if (!id) {
		return res.status(400).send({ err: true, msg: 'No id provided' });
	}

	const YD = new YoutubeMp3Downloader({
		ffmpegPath: './ffmpeg.exe', // FFmpeg binary location
		outputPath: './downloaded', // Output file location (default: the home directory)
		youtubeVideoQuality: 'highestaudio', // Desired video quality (default: highestaudio)
		queueParallelism: 2, // Download parallelism (default: 1)
		progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
		allowWebm: false, // Enable download from WebM sources (default: false)
	});

	YD.download(id);

	YD.on('finished', function (err, data) {
		res.download(data)
	});

	YD.on('error', function (error) {
		res.status(500).send({ err: true, error });
	});

	YD.on('progress', function (progress) {
		console.log(JSON.stringify(progress));
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
