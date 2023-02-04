const fs = require('fs')
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const youtubesearchapi = require("youtube-search-api");

fs.mkdirSync('./downloaded', { recursive: true })

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
	ffmpegPath: "./ffmpeg.exe", // FFmpeg binary location
	outputPath: "./downloaded", // Output file location (default: the home directory)
	youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
	queueParallelism: 2, // Download parallelism (default: 1)
	progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
	allowWebm: false, // Enable download from WebM sources (default: false)
});

//Download video and save as MP3 file
YD.download("mPmoojB54xI");

YD.on("finished", function (err, data) {
	console.log(JSON.stringify(data));
});

YD.on("error", function (error) {
	console.log(error);
});

YD.on("progress", function (progress) {
	console.log(JSON.stringify(progress));
});
