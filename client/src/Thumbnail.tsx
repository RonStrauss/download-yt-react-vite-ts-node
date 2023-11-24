import './Thumbnail.css'
import { API } from './Static';
import { TypeOptions } from 'react-toastify/dist/types';

export type ThumbnailProps = {
	  data: VideoModule.Item;
	  toast: (msg?:string,method?: TypeOptions) => void
}

export const Thumbnail = ({data,toast}:ThumbnailProps) => {

	const downloadMP3 = async (id:string) =>{
		const res = await fetch(`${API}/download?id=${id}`)
		const data = await res.json();

		if (res.ok){
			toast(data.msg, 'info')
		}
	}

  return (
	 <div className={'Thumbnail ' + (data.downloaded ? 'Thumbnail-Downloaded' : '') }>
		<span className='Thumbnail-Title'>{data.title}</span>
		{/* className={data.downloaded ? 'downloaded' : ''} */}
		{/* {data.downloaded && <span className='Thumbnail-Downloaded'>Downloaded</span>} */}
		<img src={data ? data.thumbnail.thumbnails[0].url : undefined}  onClick={()=>downloadMP3(data.id)} alt={data.title || ""} />
	 </div>
  )
}
