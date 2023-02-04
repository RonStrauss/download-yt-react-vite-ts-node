import { useEffect, useState } from 'react';
import { API } from './Static';

import './App.css';
import { Input } from './Input';
import { Thumbnail } from './Thumbnail';
import Masonry from 'react-masonry-css'
import './Masonry.css'

const breakpointColumnsObj = {
	default: 4,
	1480: 3,
	1200: 2,
	820: 1
};


function App() {
	const [videos, setVideos] = useState<VideoModule.Item[]>([]);

	const [input, setInput] = useState('')

	const [debounce, setDebounce] = useState('')

	const [debounceID, setDebounceID] = useState(0)

	const searchKeyword = async (keyword: string, signal: AbortSignal) => {
		try {

			const res = await fetch(`${API}/search?keyword=${keyword}`, { signal });
			const data: VideoModule.Video = await res.json();
			if (!data.items.length) {
				throw new Error('No videos found!')
			}
			setVideos(data.items.filter((vd) => vd.type === 'video'));
			console.log({ data });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!debounce) return;
		const controller = new AbortController();

		searchKeyword(input, controller.signal);

		return () => {
			controller.abort();
		}
	}, [debounce])

	useEffect(() => {
		setDebounceID(setTimeout(() => {
			setDebounce(input);
		}, 300))
		return () => {
			clearTimeout(debounceID)
		}
	}, [input])



	return (
		<div className="App">
			<header>
				<h1>Youtube Mp3 Downloader</h1>
			</header>
			<main>
				<div className="flex">
					<Input {...{ input, setInput }} />
				</div>
				{videos.length
					? <Masonry
						breakpointCols={breakpointColumnsObj}
						className="my-masonry-grid"
						columnClassName="my-masonry-grid_column">
						{videos.map((vd) => <Thumbnail data={vd} key={vd.id} />)}
					</Masonry>
					: <h3 style={{ textAlign: 'center' }}>Search some videos to download!</h3>}
			</main>
			<div className="backdrop">
				<div className="modal">
					<h3>Modal</h3>
					<p>Modal content</p>

					<button>Close</button>
				</div>
			</div>
		</div>
	);
}

export default App;
