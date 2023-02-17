import React from 'react'

import './Thumbnail.css'
import { API } from './Static';

export type ThumbnailProps = {
	  data: VideoModule.Item;
}

export const Thumbnail = ({data}:ThumbnailProps) => {

	const downloadMP3 = async (id:string) =>{
		const res = await fetch(`${API}/download?id=${id}`)
		const data = await res.json();

		if (res.ok){
			alert(data.msg)
		}
	}

  return (
	 <div className='Thumbnail'>
		<span className='Thumbnail-Title'>{data.title}</span>
		<img src={data ? data.thumbnail.thumbnails[0].url : undefined} onClick={()=>downloadMP3(data.id)} alt={data.title || ""} />
	 </div>
  )
}
