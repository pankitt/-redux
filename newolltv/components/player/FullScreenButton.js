import React from 'react';
import PropTypes from 'prop-types';

export default function FullScreenButton(props) {
    const activeClassName = props.fullscreenEnabled ? ' active' : '';
    return (
        <div onClick={props.switchFullscreen} className="fullscreen">
            <svg className={'btn-icon full-screen-btn' + activeClassName} width="50px" height="50px" viewBox="0 0 50 50" fill="white" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.7781746,18.636039 L27.8284271,23.5857864 C27.4379028,23.9763107 26.8047379,23.9763107 26.4142136,23.5857864 C26.0236893,23.1952621 26.0236893,22.5620972 26.4142136,22.1715729 L31.363961,17.2218254 L29.1734318,15.0312962 C28.9781696,14.836034 28.9781696,14.5194515 29.1734318,14.3241894 C29.2396947,14.2579265 29.3232454,14.2116187 29.4145554,14.1905472 L36.9484091,12.4519655 C37.2174798,12.3898723 37.4859412,12.5576607 37.5480345,12.8267314 C37.565107,12.9007124 37.565107,12.9776099 37.5480345,13.0515909 L35.8094528,20.5854446 C35.7473596,20.8545153 35.4788982,21.0223037 35.2098275,20.9602104 C35.1185174,20.9391389 35.0349667,20.8928311 34.9687038,20.8265682 L32.7781746,18.636039 Z" className="full-screen-btn_arrow1"/>
                <path d="M17.2218254,31.363961 L22.1715729,26.4142136 C22.5620972,26.0236893 23.1952621,26.0236893 23.5857864,26.4142136 C23.9763107,26.8047379 23.9763107,27.4379028 23.5857864,27.8284271 L18.636039,32.7781746 L20.8265682,34.9687038 C20.8928311,35.0349667 20.9391389,35.1185174 20.9602104,35.2098275 C21.0223037,35.4788982 20.8545153,35.7473596 20.5854446,35.8094528 L13.0515909,37.5480345 C12.9776099,37.565107 12.9007124,37.565107 12.8267314,37.5480345 C12.5576607,37.4859412 12.3898723,37.2174798 12.4519655,36.9484091 L14.1905472,29.4145554 C14.2116187,29.3232454 14.2579265,29.2396947 14.3241894,29.1734318 C14.5194515,28.9781696 14.836034,28.9781696 15.0312962,29.1734318 L17.2218254,31.363961 Z" className="full-screen-btn_arrow2"/>
            </svg>
        </div>
    );
}

FullScreenButton.propTypes = {
    fullscreenEnabled: PropTypes.bool.isRequired,
    switchFullscreen: PropTypes.func.isRequired,
};