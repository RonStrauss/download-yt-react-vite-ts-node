import React, { useState } from 'react';
import './Input.css';

export type InputProps = {
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
};

export const Input = ({input, setInput}:InputProps) => {



	return (
		<label className="inp" htmlFor="inp">
			<input placeholder=" " value={input} onInput={e=>{setInput((e.target as HTMLInputElement).value)}} id="inp" type="text" />
			<span className="label">Search Videos</span>
			<span className="focus-bg"></span>
			<span className="material-symbols-outlined suffix-icon">search</span>
		</label>
	);
};
