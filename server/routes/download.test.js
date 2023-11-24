// FILEPATH: /e:/Self_Programming/Fullstack/download-yt-react-vite-ts-node/server/routes/download.test.js
const fs = require('fs');
const path = require('path');
const realPath = jest.requireActual('path');
const { writeVideoDetailJson } = require('./download');
const { downloadMP3 } = require('./download');
const ytdl = require('ytdl-core');

jest.mock('fs', () => ({
	writeFile: jest.fn().mockImplementation((path, data, encoding, callback) => callback(null)),
	readFileSync: jest.fn().mockReturnValue([]),
	readdirSync: jest.fn().mockReturnValue([]),
	mkdirSync: jest.fn().mockReturnValue([]),
	writeFileSync: jest.fn().mockReturnValue([]),
}));
jest.mock('path');
jest.mock('ytdl-core', () => {
	const mYtdl = { pipe: jest.fn() };
	const ytdlFn = jest.fn(() => mYtdl);
	ytdlFn.getBasicInfo = jest.fn().mockResolvedValue({ player_response: { videoDetails: { title: 'test' } } });
	return ytdlFn;
});
jest.mock('fluent-ffmpeg', () => {
	const mFfmpeg = { audioBitrate: jest.fn().mockReturnThis(), save: jest.fn().mockReturnThis(), on: jest.fn().mockReturnThis() };
	const ffmpegFn = jest.fn(() => mFfmpeg);
	return ffmpegFn;
});
jest.mock('readline', () => ({
	cursorTo: jest.fn(),
}));
jest.mock('socket.io', () => ({
	Server: jest.fn().mockImplementation(() => ({
		on: jest.fn(),
		emit: jest.fn(),
	})),
}));

describe('writeVideoDetailJson', () => {
	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods:
		fs.writeFile.mockClear();
		fs.readFileSync.mockClear();
		fs.readdirSync.mockClear();
		path.join.mockClear();
	});

	it('should call path.join with correct parameters', () => {
		const mockData = { id: '123', videoTitle: 'test', videoDetails: {} };
		const root = realPath.join(__dirname, '..');
		writeVideoDetailJson(mockData);
		expect(path.join).toHaveBeenCalledWith(root, 'downloaded', 'jsons', `${mockData.id} - ${mockData.videoTitle}.json`);
	});

	it('should call fs.writeFile with correct parameters', () => {
		const mockData = { id: '123', videoTitle: 'test', videoDetails: {} };
		const mockPath = '/mock/path';
		path.join.mockReturnValue(mockPath);
		writeVideoDetailJson(mockData);
		expect(fs.writeFile).toHaveBeenCalledWith(mockPath, JSON.stringify(mockData.videoDetails, null, 4), 'utf8', expect.any(Function));
	});

	it('should log error when fs.writeFile fails', () => {
		const mockData = { id: '123', videoTitle: 'test', videoDetails: {} };
		const mockError = new Error('writeFile error');
		fs.writeFile.mockImplementation((path, data, encoding, callback) => callback(mockError));
		console.log = jest.fn();
		writeVideoDetailJson(mockData);
		expect(console.log).toHaveBeenCalledWith('An error occurred while writing JSON Object to File.');
		expect(console.log).toHaveBeenCalledWith(mockError);
	});

	it('should log success when fs.writeFile succeeds', () => {
		const mockData = { id: '123', videoTitle: 'test', videoDetails: {} };
		fs.writeFile.mockImplementation((path, data, encoding, callback) => callback(null));
		console.log = jest.fn();
		writeVideoDetailJson(mockData);
		expect(console.log).toHaveBeenCalledWith('JSON file has been saved.');
	});
});

describe('downloadMP3', () => {
	beforeEach(() => {
		ytdl.getBasicInfo.mockClear();
		ytdl.mockClear();
	});

	it('should call ytdl with correct parameters', () => {
		const mockData = { id: '123', name: 'test' };
		downloadMP3(mockData);
		expect(ytdl).toHaveBeenCalledWith(mockData.id, { quality: 'highestaudio' });
	});

	it('should call handleDownloadAndWrite and writeVideoDetailJson when name is not provided', async () => {
		const mockData = { id: '123' };
		const mockInfo = { player_response: { videoDetails: { title: 'test' } } };
		ytdl.getBasicInfo.mockResolvedValue(mockInfo);
		const handleDownloadAndWrite = jest.fn();
		const writeVideoDetailJson = jest.fn();
		await downloadMP3(mockData);
		expect(handleDownloadAndWrite).toHaveBeenCalledWith({
			stream: expect.anything(),
			videoTitle: mockInfo.player_response.videoDetails.title,
			start: expect.any(Number),
			id: mockData.id,
		});
		expect(writeVideoDetailJson).toHaveBeenCalledWith({
			id: mockData.id,
			videoTitle: mockInfo.player_response.videoDetails.title,
			videoDetails: mockInfo.player_response.videoDetails,
		});
	});

	it('should log error when ytdl.getBasicInfo fails', async () => {
		const mockData = { id: '123' };
		const mockError = new Error('getBasicInfo error');
		ytdl.getBasicInfo.mockRejectedValue(mockError);
		console.log = jest.fn();
		await downloadMP3(mockData);
		expect(console.log).toHaveBeenCalledWith(mockError);
	});

	it('should call handleDownloadAndWrite when name is provided', () => {
		const mockData = { id: '123', name: 'test' };
		const handleDownloadAndWrite = jest.fn();
		downloadMP3(mockData);
		expect(handleDownloadAndWrite).toHaveBeenCalledWith({ stream: expect.anything(), name: mockData.name, start: expect.any(Number), id: mockData.id });
	});
});
