import React, { Component } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import CarouselEpg from '../carousel/CarouselEpg';

export default class ScrollUpEpg extends Component {
    static propTypes = {
        epg: PropTypes.object,
        activeChannel: PropTypes.object,
    }
    render() {
        const { epg, activeChannel } = this.props;
        if (!epg) return null;

        const epgGroupedByDay = groupBy(epg, item => item.startDate),
            currentProgramId = activeChannel.currentProgramId;

        return (
            <div className="channels-epg-wrapper">
                <CarouselEpg epg={epgGroupedByDay} currentProgramId={currentProgramId}/>
            </div>
        );
    }
}
