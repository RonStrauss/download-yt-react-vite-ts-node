import { useState } from 'react';

import './App.css';
import { Input } from './Input';

function App() {
	const [videos, setVideos] = useState([{ name: 'Best video Ever!' }]);

	return (
		<div className="App">
			<header>
				<h1>Youtube Mp3 Downloader</h1>
			</header>
			<main>
				<div className="flex">
					<Input />
				</div>
				<div className="grid">{videos.length ? videos.map((vd) => <div></div>) : <h3 style={{ textAlign: 'center' }}>Search some videos to download!</h3>}</div>
			</main>
		</div>
	);
}

export default App;
