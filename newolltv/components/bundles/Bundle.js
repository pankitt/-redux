import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import { inflect } from '../../helpers/string';
import t from '../../i18n';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import { PERIOD_D14 } from '../../constants';


export default class Bundle extends Component {
    static propTypes = {
        item: PropTypes.object,
        isActive: PropTypes.bool,
        isDisabled: PropTypes.bool,
        channels: PropTypes.object,
        specialOffers: PropTypes.object,
        onClick: PropTypes.func,
        onSelect: PropTypes.func,
    }

    handleButtonClick = (id, action, e) => {
        e.stopPropagation();
        this.props.onSelect(id, action);
    }

    getHDCount = () => {
        const { item, channels } = this.props;
        let hdCount = 0;
        if (item && !!item.channels.length && !!Object.keys(channels).length) {
            forEach(item.channels, id => {
                const channel = channels[id];
                if (channel && channel.hd === 1) hdCount++;
            });
        }
        return hdCount;
    }

    render() {
        const { item, isActive, channels, specialOffers } = this.props;

        const blockSizeClassName = 'size-' + item.blockSize;
        const isActiveClassName = isActive ? 'active' : '';
        const price = item.price.split('.')[1] === '00' ? item.price.split('.')[0] : item.price;

        const specialOfferMarker = item.specialOfferId ? specialOffers[item.specialOfferId + ''] : null;

        const channelsTemplate = <div className="bundle-contains">
            {item.channels.length <= 4 ?
                <div className="channels">
                    {map(item.channels, id => <span key={id}>{channels && channels[id] ? channels[id].title : ''}</span>)}

                </div> :
                <div>
                    <span className="text-primary">{item.channels.length}</span> {inflect(item.channels.length, t('inflect_channel'))}
                    {item.vod ? <span> + {t('Videolibrary')}</span> : null}
                </div> }
            {item.subsId === 15212 || item.subsId === 15214 || item.subsId === 15210 ? <div className="hd-count">{this.getHDCount() > 0 ? this.getHDCount() : ''} в HD</div> : null}
        </div>;

        const bundlePeriodHumanize = item.duration === PERIOD_D14 ? t('Two weeks') : t('month_short');

        return (
            <div className={'bundle ' + blockSizeClassName + ' ' + isActiveClassName} onClick={() => this.props.onClick(item.subsId)} id={'bundle-' + item.subsId}>
                <div className="bundle-inner">
                    <div className="bundle-head">
                        <h2>{item.name}</h2>
                        <div className="bundle-head-right">
                            <span className="price">{price} грн/{bundlePeriodHumanize}.{specialOfferMarker}</span>
                            <Button isSmall isPrimary customClassName="icon-cart" onClick={(e) => this.handleButtonClick(item.subsId, 'add', e)} ref={el => this.addButton = el}/>
                        </div>
                    </div>
                    <div className="bundle-body">
                        {!!item.channels.length ? channelsTemplate : <div className="bundle-descr">
                            {item.description}
                        </div>}
                        <div className="bundle-image" style={{ backgroundImage: 'url(' + item.blockImage + ')' }}/>
                    </div>
                </div>
            </div>
        );
    }
}
