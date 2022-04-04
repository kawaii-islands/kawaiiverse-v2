import React, { CSSProperties } from 'react';
import './LoadingPage.css';
import loadingIcon from 'src/assets/icons/loading.png';

const LoadingPage = () => {
	return (
		<>
			<div className='loading-page'>
				<img
					src={loadingIcon}
					alt="loading-icon"
					className='icn-spinner'
				/>
				<div className='loading-title'>
					<span style={{ "--i": 1 }}>K</span>
					<span style={{ "--i": 2 }}>A</span>
					<span style={{ "--i": 3 }}>W</span>
					<span style={{ "--i": 4 }}>A</span>
					<span style={{ "--i": 5 }}>I</span>
					<span style={{ "--i": 6 }}>I</span>
					<span style={{ "--i": 7 }}>V</span>
					<span style={{ "--i": 8 }}>E</span>
					<span style={{ "--i": 9 }}>R</span>
					<span style={{ "--i": 10 }}>S</span>
					<span style={{ "--i": 11 }}>E</span>
					<span style={{ "--i": 12 }}>.</span>
					<span style={{ "--i": 13 }}>.</span>
					<span style={{ "--i": 14 }}>.</span>
				</div>
				<div></div>
			</div>
		</>
	)
}

export default LoadingPage;