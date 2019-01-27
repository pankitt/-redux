import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import t from '../../i18n';
import Tags from './Tags';
import durationToStr from '../../helpers/durationToStr';

const toHHMMSS = (v) => {
    let duration = parseInt(v, 10);
    if (!duration) return '';
    let hours, minutes, seconds;
    seconds = duration % 60;
    minutes = (duration - seconds) % 3600;
    hours   = (duration - minutes - seconds) / 3600;
    minutes /= 60;
    return (hours ? `${hours} ${t('h')} ` : '') + (minutes ? `${minutes} ${t('min')}` : '');
};

export default function Details(props) {
    const { id, description, directors, src, audioLangs, originalTitle, genres, genresIds, country, year, age, isHD, duration, subtitleLangs, isAmedia } = props;

    if (!id) return null;

    const directorsArray = directors ? directors.split(',') : [];

    const directorsTemplate = directorsArray.length > 0 ? <div className="data-item">
        <div className="data-item-title">{t('Directed by')}</div>
        <div className="data-item-content">{
            map(directorsArray, (director, i) => <div key={i} itemProp="director" itemScope itemType="http://schema.org/Person"><span itemProp="name">{director}</span></div>)
        }</div>
    </div> : null;

    const audioLangsTemplate = audioLangs ? <div className="data-item">
        <div className="data-item-title">{t('Audio')}</div>
        <div className="data-item-content">{ map(audioLangs.split(','), (lang, i) => <div key={i}>{lang}</div>) }</div>
    </div> : null;

    const amediaClassName = isAmedia ? ' amedia-logo ' : '';

    return (
        <div className="details-block">
            <div className="container rel">
                <div className="desktop">
                    <div className="poster-block">
                        <div className={'poster' + amediaClassName} style={{ backgroundImage: 'url(' + src + ')' }}/>
                        <meta itemProp="image" content={src} />
                        <div className="subtitle">
                            {originalTitle ? <span>{originalTitle}</span> : null}
                            {country ? <span>{country}</span> : null}
                            {year ? <span itemProp="datePublished">{year}</span> : null}
                            {age ? <span>{age}+</span> : null}
                            <span>{isHD ? <span className="marker-hd"/> : ''}</span>
                            <Tags tagsOrder={genresIds} tags={genres} />
                        </div>

                    </div>
                    <div className="data">
                        <div className="data-row">
                            <div className="data-item story">
                                <div className="data-item-title">{t('Storyline')}</div>
                                <div className="data-item-content" itemProp="description">{description}</div>
                            </div>
                        </div>
                        <div className="data-row">
                            {directorsTemplate}
                            {/*
                            <div className="data-item">
                                <div className="data-item-title">Сценарий</div>
                                <div className="data-item-content">
                                    <div>Нет данных, надо узнать</div>
                                </div>
                            </div>
                            */}
                            {audioLangsTemplate}
                            {subtitleLangs ?
                                <div className="data-item">
                                    <div className="data-item-title">{t('Subtitles')}</div>
                                    <div className="data-item-content">{subtitleLangs ? map(subtitleLangs.split(',')) : 'Нет' }</div>
                                </div>
                                : null
                            }
                            {duration ? <div className="data-item">
                                <div className="data-item-title">{t('Duration')}</div>
                                <div className="data-item-content">
                                    <div itemProp="duration" content={durationToStr(duration)}>{toHHMMSS(duration)}</div>
                                </div>
                            </div> : null}
                        </div>
                    </div>
                </div>
            </div>
            {isAmedia ? <div className="container amediaCopy">© 2017 Home Box Office, Inc. All rights reserved. HBO® and all related service marks are the property of Home Box Office, Inc.</div> : null}
        </div>
    );
}

Details.propTypes = {
    id: PropTypes.number,
    audioLangs: PropTypes.string,
    subtitleLangs: PropTypes.string,
    src: PropTypes.string,
    description: PropTypes.string,
    directors: PropTypes.string,
    age: PropTypes.string,
    country: PropTypes.string,
    year: PropTypes.number,
    isHD: PropTypes.bool,
    originalTitle: PropTypes.string,
    duration: PropTypes.number,
    genresIds: PropTypes.array,
    genres: PropTypes.object,
    isAmedia: PropTypes.bool,
};
