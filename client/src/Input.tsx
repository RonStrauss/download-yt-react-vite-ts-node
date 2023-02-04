import React from 'react';
import './Input.css';

export const Input = () => {
	return (
		<label className="inp" htmlFor="inp">
			<input placeholder=" " id="inp" type="text" />
			<span className="label">Search Videos</span>
			<span className="focus-bg"></span>
			<span className="material-symbols-outlined suffix-icon">search</span>
		</label>
	);
};
