import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import EpgItem from './EpgItem';

function ChannelEPG(props) {
    const { currentProgramId, activeProgramId, channelEpg } = props;
    const now = Date.now();
    return (
        <div className="epg" ref={props.forwardedRef}>
            {map(props.ids, (id, index) => {
                const item = channelEpg[id];
                return <EpgItem
                    {...item}
                    key={index}
                    isLive={item.id === currentProgramId}
                    active={item.id === activeProgramId}
                    hasRecord={item.dvr === 1 || (item.dvr === -1 && item.stop < now)}
                    onClick={props.onClick}
                />;
            })}
        </div>
    );
}

ChannelEPG.propTypes = {
    channelEpg: PropTypes.object.isRequired,
    ids: PropTypes.array.isRequired,
    currentProgramId: PropTypes.number,
    activeProgramId: PropTypes.number,
    onClick: PropTypes.func.isRequired,
    forwardedRef: PropTypes.object,
};

export default forwardRef((props, ref) => <ChannelEPG {...props} forwardedRef={ref}/>);