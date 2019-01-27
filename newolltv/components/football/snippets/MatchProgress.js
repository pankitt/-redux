import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../i18n';
import { MATCH_HALFTIME } from '../../constants';

class MatchProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: Date.now(),
        };
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ now: Date.now() });
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        const { start, status } = this.props;
        const position = start / 90 * 100;
        let timeClassName = '';
        if (start < 10) {
            timeClassName = 'to-left';
        } else if (start > 80) {
            timeClassName = 'to-right';
        }
        return (
            <div className="progress progress-match" style={{ width: position + '%' }}>
                <div className={'time ' + timeClassName}>{status === MATCH_HALFTIME ? t('Halftime') : start + ' ' + t('min')}</div>
            </div>
        );
    }
}

MatchProgress.propTypes = {
    start: PropTypes.number,
    status: PropTypes.number,
};

export default MatchProgress;
