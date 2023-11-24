import { useEffect, useReducer, useState } from 'react';
import { API } from './Static';

import './App.css';
import { Input } from './Input';
import { Thumbnail } from './Thumbnail';
import Masonry from 'react-masonry-css';
import './Masonry.css';
import socketIOClient from 'socket.io-client';
import { Online } from './Online';
import { toast, ToastContainer } from 'react-toastify';
import { ToastOptions, TypeOptions } from 'react-toastify/dist/types/index';
import 'react-toastify/dist/ReactToastify.css';
import { MP3sStore } from './Types/Store';

const breakpointColumnsObj = {
	default: 4,
	1480: 3,
	1200: 2,
	820: 1,
};

const triggerToast = (msg?: string, method?: TypeOptions) => {
	const options: ToastOptions = {
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		theme: 'light',
		type: method ? method : 'success',
	};

	toast(msg ? msg : 'Toasty!', options);
};

function App() {
	const [videos, setVideos] = useState<VideoModule.Item[]>([]);

	const [input, setInput] = useState('');

	const [debounce, setDebounce] = useState('');

	const [debounceID, setDebounceID] = useState(0);

	const [online, setOnline] = useState(false);

	const [mp3sDownloadedStore, setMp3sDownloadedStore] = useState<MP3sStore>({ downloaded: {}, downloading: {} });


	const searchKeyword = async (keyword: string, signal: AbortSignal) => {
		try {
			const res = await fetch(`${API}/search?keyword=${keyword}`, { signal });
			const data: VideoModule.Video = await res.json();
			if (!data.items.length) {
				throw new Error('No videos found!');
			}
			const videos = data.items.filter((vd) => vd.type === 'video');
			const videosAlreadyDownloaded = new Set(videos.filter((vd) => vd.downloaded).map((vd) => vd.id));
			setVideos(videos);
			setMp3sDownloadedStore({
				...mp3sDownloadedStore,
				downloaded: { ...mp3sDownloadedStore.downloaded, ...Object.fromEntries([...videosAlreadyDownloaded].map((id) => [id, true])) },
			});
			console.log({ data });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const socket = socketIOClient(API).on('connect', () => {
			console.log('connected to WS');
			setOnline(true);
		});

		socket.on('download-finished-io', (json: string) => {
			const { name, id } = JSON.parse(json);
			setMp3sDownloadedStore({
				...mp3sDownloadedStore,
				downloading: { ...mp3sDownloadedStore.downloading, [id]: false },
				downloaded: { ...mp3sDownloadedStore.downloaded, [id]: true },
			});
			triggerToast('Download finished for: ' + name + ' !');
		});

		return () => {
			socket.disconnect();
			setOnline(false);
		};
	}, []);

	useEffect(() => {
		if (!debounce) return;
		const controller = new AbortController();

		searchKeyword(input, controller.signal);

		return () => {
			controller.abort();
		};
	}, [debounce]);

	useEffect(() => {
		setDebounceID(
			setTimeout(() => {
				setDebounce(input);
			}, 500),
		);
		return () => {
			clearTimeout(debounceID);
		};
	}, [input]);

	return (
		<div className='App'>
			<Online online={online} />
			<header>
				<h1>Youtube Mp3 Downloader</h1>
			</header>
			<main>
				<div className='flex'>
					<Input {...{ input, setInput }} />
				</div>
				{videos.length ? (
					<Masonry breakpointCols={breakpointColumnsObj} className='my-masonry-grid' columnClassName='my-masonry-grid_column'>
						{videos.map((vd) => (
							<Thumbnail data={vd} key={vd.id} {...{ mp3sDownloadedStore, setMp3sDownloadedStore }} toast={triggerToast} />
						))}
					</Masonry>
				) : (
					<h3 style={{ textAlign: 'center' }}>Search some videos to download!</h3>
				)}
			</main>
			<ToastContainer />
		</div>
	);
}

export default App;
