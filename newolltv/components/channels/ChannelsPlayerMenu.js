import React from 'react';
import PropTypes from 'prop-types';
import SwitchContentButton from '../player/SwitchContentButton';
import ProgramInfo from './ProgramInfo';
import MyChannelsSidebar from './MyChannelsSidebar';
import ChannelEPGSidebar from './ChannelEPGSidebar';
import SidebarPortal from '../SidebarPortal';
import Button from '../Button';
import t from '../../i18n';

import { ChannelsPageContext } from '../../containers/Channels';

export default function ChannelsPlayerMenu({ showLeftSideBar, showRightSideBar, showedLeftSideBar, showedRightSideBar, hideSideBar, fullscreenEnabled, visible }) {
    return (
        <ChannelsPageContext.Consumer>
            {({ auth, currentChannel, programId, currentProgram, channels, switchToDvr, getChannelEpg, prevChannel, nextChannel, switchChannel }) => {
                return (
                    <div className={visible ? null : 'dn'}>
                        <Button isDefault withIcon title={t('My channels')} onClick={showLeftSideBar} customClassName="my-channels-btn"/>
                        <Button isDefault withIcon title={t('TV Program')} onClick={showRightSideBar} customClassName="tv-program-btn"/>
                        {currentProgram ? <ProgramInfo
                            dvr={currentProgram.dvr}
                            stop={currentProgram.stop}
                            startTime={currentProgram.startTime}
                            isLive={currentProgram.id === currentChannel.currentProgramId}
                            title={currentProgram.title}
                            currentChannel={currentChannel.title}
                        /> : null}
                        {prevChannel ? <SwitchContentButton onClick={() => switchChannel(prevChannel.id)} title={prevChannel.title} prev /> : null}
                        {nextChannel ? <SwitchContentButton onClick={() => switchChannel(nextChannel.id)} title={nextChannel.title} /> : null}
                        {showedLeftSideBar || showedRightSideBar ?
                            <SidebarPortal fullScreen={fullscreenEnabled} key={fullscreenEnabled ? 0 : 1} >
                                <div className="sidebar-overlay active" onClick={hideSideBar}/>
                                {showedLeftSideBar ? <MyChannelsSidebar
                                    channels={channels}
                                    onClose={hideSideBar}
                                    currentChannel={currentChannel}
                                    switchChannel={switchChannel}
                                    isSigned={auth.signed}
                                /> : null }
                                {showedRightSideBar ? <ChannelEPGSidebar
                                    onClose={hideSideBar}
                                    switchToDvr={switchToDvr}
                                    currentChannel={currentChannel}
                                    switchChannel={switchChannel}
                                    activeProgramId={programId || currentChannel.currentProgramId || 0}
                                    getChannelEpg={getChannelEpg}
                                /> : null}
                            </SidebarPortal>
                            : null
                        }
                    </div>
                );
            }}

        </ChannelsPageContext.Consumer>
    );
}

ChannelsPlayerMenu.propTypes = {
    showLeftSideBar: PropTypes.func.isRequired,
    showRightSideBar: PropTypes.func.isRequired,
    showedLeftSideBar: PropTypes.func.isRequired,
    showedRightSideBar: PropTypes.func.isRequired,
    hideSideBar: PropTypes.func.isRequired,
    fullscreenEnabled: PropTypes.bool,
    visible: PropTypes.bool.isRequired,
};