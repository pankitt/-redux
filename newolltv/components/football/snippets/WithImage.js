import React from 'react';
import PropTypes from 'prop-types';

const WithImage = (props) => {
    const { logo, customClassName } = props;
    return (
        <div className={ 'snippet with-image ' + customClassName} style={{ backgroundImage: 'url(' + logo + ')' }}/>
    );
};

WithImage.propTypes = {
    logo: PropTypes.string,
    customClassName: PropTypes.string,
};

export default WithImage;
