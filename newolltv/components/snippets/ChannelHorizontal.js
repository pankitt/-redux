import React, { Component } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';

export default class ChannelHorizontal extends Component {
    static propTypes = {
        id: PropTypes.number,
        poster: PropTypes.string,
        isActiveClassName: PropTypes.string,
        nextThree: PropTypes.array,
        currentProgramId: PropTypes.number,
        onClick: PropTypes.func.isRequired,
        isFavorite: PropTypes.bool.isRequired,
        isUnderParentalProtect: PropTypes.bool.isRequired,
        withActions: PropTypes.bool.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    handleFeaturesButtonClick = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const { poster, id, isFavorite, isUnderParentalProtect, nextThree, currentProgramId } = this.props;

        const { isOpen } = this.state;
        const isOpenFeaturesClassName = isOpen ? 'open' : '';
        const currentProgram = find(nextThree, item => item.id === currentProgramId);
        return (
            <div id={id} className={'snippet channel-horizontal ' + isOpenFeaturesClassName + this.props.isActiveClassName} onClick={isOpen ? null : this.props.onClick}>
                <div className="poster" style={{ backgroundImage:'url(' + poster + ')' }}/>
                {currentProgram && currentProgram.id ? <div className="epg">
                    <div className="epg-item" key={currentProgram.id}>
                        <div className="time">{currentProgram.startTime}</div>
                        <div className="marker"/>
                        <div className="title">{currentProgram.title}</div>
                    </div>
                </div> : null}

                {this.props.withActions ?
                    <div className="actions">
                        <div className="features-btn" onClick={this.handleFeaturesButtonClick}/>
                        <div className="features">
                            <div className={'btn icon parental' + (isFavorite ? ' active' : '')} />
                            <div className={'btn icon favourite' + (isUnderParentalProtect ? ' active' : '')} />
                            <div className="btn icon pin"/>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}
