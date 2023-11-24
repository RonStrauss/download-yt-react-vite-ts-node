import './Thumbnail.css';
import { API } from './Static';
import { TypeOptions } from 'react-toastify/dist/types';
import { MP3sStore } from './Types/Store';

export type ThumbnailProps = {
	data: VideoModule.Item;
	toast: (msg?: string, method?: TypeOptions) => void;
	mp3sDownloadedStore: MP3sStore;
	setMp3sDownloadedStore: React.Dispatch<React.SetStateAction<MP3sStore>>;
};

export const Thumbnail = ({ data, toast, mp3sDownloadedStore, setMp3sDownloadedStore }: ThumbnailProps) => {
	const downloadMP3 = async ({ id, isDownload, e }: { id: string; isDownload: boolean; e: React.MouseEvent }) => {
		if (e.target instanceof HTMLSpanElement) return;
		if (isDownload) {
			const message = mp3sDownloadedStore.downloaded[id] ? 'Already downloaded!' : 'Downloading...';
			toast(message, 'info');
			return;
		}
		const res = await fetch(`${API}/download?id=${id}`);
		const data = await res.json();

		if (res.ok) {
			toast(data.msg, 'info');
			setMp3sDownloadedStore({ ...mp3sDownloadedStore, downloading: { ...mp3sDownloadedStore.downloading, [id]: true } });
		}
	};

	const anyDownload = data.downloaded || mp3sDownloadedStore.downloaded[data.id] || mp3sDownloadedStore.downloading[data.id];

	return (
		<div
			className={
				'Thumbnail ' +
				(data.downloaded || mp3sDownloadedStore.downloaded[data.id] ? 'Thumbnail-Downloaded' : '') +
				(mp3sDownloadedStore.downloading[data.id] ? ' Thumbnail-Downloading' : '')
			}
			onClick={(e) => downloadMP3({ id: data.id, isDownload: anyDownload, e })}
		>
			<span className='Thumbnail-Title'>{data.title}</span>
			<img src={data ? data.thumbnail.thumbnails[0].url : undefined} alt={data.title || ''} />
		</div>
	);
};
