import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
// import { Link } from 'react-router-dom';

CarouselItemMain.propTypes = {
    age: PropTypes.number,
    countries: PropTypes.array,
    hd: PropTypes.number,
    id: PropTypes.number,
    subtitle: PropTypes.string,
    tags: PropTypes.object,
    title: PropTypes.string,
    img: PropTypes.string,
    url: PropTypes.string,
    year: PropTypes.number,
};

export default function CarouselItemMain(props) {
    const { title, subtitle, countries, tags, year, age, url, img, hd } = props;
    const style = { marginRight: 10 };
    let elements = [];
    if (subtitle) {
        elements.push(
            <span style={style}>{subtitle}</span>
        );
    }
    if (countries) {
        elements.push(
            <span style={style}>{countries.join(', ')}</span>
        );
    }
    if (year) {
        elements.push(
            <span style={style}>{year}</span>
        );
    }
    if (age) {
        elements.push(
            <span style={style}>{age + '+'}</span>
        );
    }
    if (hd) {
        // FIXME: hd icon
        elements.push(
            <span style={style} className="hd">{'HD'}</span>
        );
    }
    return (
        <div className="carousel-item" style={{ backgroundImage: 'url(' + img + ')', cursor: 'pointer' }} onClick={() => {window.location.href = url}}>
            {/* TODO ^^^: rework thing with cursor style. */}
            <div className="container rel">
                <div className="title">{title}</div>
                <div className="subtitle">{elements}</div>
                <div className="tags">
                    {map(tags, (tag, t) => <div className="tag" key={t}>{tag}</div>)}
                </div>
                <div className="actions">
                    {/* <Link to={'/vod/' + id} className="btn default trailer with-icon">Трейлер</Link> */}
                    {/* <div className="left">
                        <div className="btn icon like active"></div>
                        <div className="btn icon dislike"></div>
                    </div>
                    <div className="right">
                        <div className="btn icon parental"></div>
                        <div className="btn icon favourite"></div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
