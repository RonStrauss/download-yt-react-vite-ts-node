import React from 'react'

import './Thumbnail.css'

export type ThumbnailProps = {
	  data: VideoModule.Item;
}

export const Thumbnail = ({data}:ThumbnailProps) => {
  return (
	 <div className='Thumbnail'>
		<span className='Thumbnail-Title'>{data.title}</span>
		<img src={data?.thumbnail?.thumbnails?.[0]?.url} alt={data?.title || ""} />
	 </div>
  )
}
