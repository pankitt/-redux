import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import t from '../../i18n';

export default class WithPoster extends Component {
    static propTypes = {
        customClassName: PropTypes.string,
        link: PropTypes.string,
        coverLarge: PropTypes.string,
        additionalCover: PropTypes.string,
        isAmedia: PropTypes.bool,
        showAmediaCover: PropTypes.bool,
        title: PropTypes.string,
        year: PropTypes.number,
        vodMarkers: PropTypes.array,
        genre: PropTypes.string,
        isHorizontal: PropTypes.bool,
        features: PropTypes.object,
        isHD: PropTypes.bool,
        withoutOptions: PropTypes.bool,
        setSnippetOrigin: PropTypes.func,
        closeBtn: PropTypes.bool,
        onCloseBtnClick: PropTypes.func,
        showViewPercentage: PropTypes.bool,
        viewPercentage: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            overlay: false,
        };
    }

    _handleFeaturesClick = (event) => {
        event.preventDefault();
        this.setState({ overlay: !this.state.overlay });
    }

    // handleSnippetClick = () => {
    //     const { left, top, width, height } = this.snippet.getBoundingClientRect();
    //     const origin = {
    //         x: left + width / 2,
    //         y: top +  height / 2,
    //     };
    //     this.props.setSnippetOrigin(origin);
    // }

    render() {
        // const overlayTemplate = <div className="overlay">
        //     <div className="overlay-btn like">
        //         <div className="descr">Нравится</div>
        //     </div>
        //     <div className="overlay-btn dislike">
        //         <div className="descr">Не нравится</div>
        //     </div>
        //     <div className="overlay-btn parental">
        //         <div className="descr">Род. контроль</div>
        //     </div>
        //     <div className="overlay-btn favourite">
        //         <div className="descr">Избранное</div>
        //     </div>
        // </div>;
        const { coverLarge, additionalCover, isAmedia, customClassName, title, link, year, genre, vodMarkers   } = this.props;
        const bluredClassName = this.state.overlay ? 'blured' : '';
        const amediaClassName = isAmedia ? ' amedia-logo ' : '';
        const showAmediaCover = this.props.showAmediaCover !== undefined ? this.props.showAmediaCover : isAmedia;

        let seekTimeProgressBar = !this.props.showViewPercentage ? null : (
            <div className="seek-time-progress-bar">
                <div style={{ width: this.props.viewPercentage + '%' }}/>
            </div>
        );

        let closeButton = !this.props.closeBtn ? null : (
            <div className="close-btn" onClick={this.props.onCloseBtnClick}/>
        );

        return (
            <div itemScope itemType="http://schema.org/Movie" className={'snippet with-poster ' + (customClassName || '')} ref={el => this.snippet = el}>
                <meta itemProp="name" content={title} />
                <div className={'poster ' + bluredClassName + amediaClassName} itemProp="potentialAction" itemScope itemType="http://schema.org/WatchAction">
                    <Link to={link ? link : ''} itemProp="target">
                        <img src={showAmediaCover ? additionalCover : coverLarge} alt={title}/>
                    </Link>
                    <div className="markers">
                        {vodMarkers && vodMarkers.length > 0 ? <div className="right">
                            <div className={'marker-snippet ' + vodMarkers[0]}>{t(vodMarkers[0] === 'new_episode' ? 'New' : 'Soon')}</div>
                        </div> : null}
                    </div>
                    {closeButton}
                    {seekTimeProgressBar}
                </div>
                <div className="actions">
                    <div className="title">{title}</div>
                    <div className="subtitle">
                        <span className="year">{(year || '')}</span>
                        {(genre || '')}
                    </div>
                    {/* <div className={'features-btn ' + featuresClassName} onClick={this._handleFeaturesClick}></div> */}
                </div>
            </div>
        );
    }
}
