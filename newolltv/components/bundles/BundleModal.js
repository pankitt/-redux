import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import { inflect } from '../../helpers/string';
import t from '../../i18n';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { PERIOD_D14 } from '../../constants';


export default class BundleModal extends Component {
    static propTypes = {
        item: PropTypes.object,
        isActive: PropTypes.bool,
        channels: PropTypes.object,
        specialOffers: PropTypes.object,
        isDisabled: PropTypes.bool,
        onClick: PropTypes.func,
        onSelect: PropTypes.func,
    }

    handleButtonClick = (id) => {
        this.props.onSelect(id, 'add');
        setTimeout(() => {
            this.props.onClick(id, 'remove');
        }, 10);
    }

    getHDCount = () => {
        const { item, channels } = this.props;
        let hdCount = 0;
        if (item && !!item.channels.length && !!Object.keys(channels).length) {
            forEach(item.channels, id => {
                const channel = channels[id];
                if (channel && channel.hd) hdCount++;
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
        const bundlePeriodHumanize = item.duration === PERIOD_D14 ? t('Two weeks') : t('month_short');
        return (
            <div className={'bundle bundle-modal-block ' + blockSizeClassName + ' ' + isActiveClassName} id={'bundle-modal-' + item.subsId}>
                <div className="bundle-inner">
                    <div className="bundle-head">
                        <h2>{item.name}</h2>
                        <div className="bundle-head-right">
                            <span className="price">{price} грн/{bundlePeriodHumanize}.{specialOfferMarker}</span>
                            <Button isSmall isPrimary customClassName="withc-icon with-icon-cart" title={t('To cart')} onClick={() => this.handleButtonClick(item.subsId)}/>
                        </div>
                    </div>
                    <div className="bundle-body">
                        <div className="bundle-image" style={{ backgroundImage: 'url(' + item.blockImage + ')' }}/>
                        <div className="bundle-contains">
                            {item.channels.length <= 4 ?
                                <div className="channels">{map(item.channels, id => <span key={id}>{channels && channels[id] ? channels[id].title : ''}</span>)}</div> :
                                <div>
                                    <span className="text-primary">{item.channels.length}</span> {inflect(item.channels.length, t('inflect_channel'))}
                                    {item.vod ? <span> + {t('Videolibrary')}</span> : null}
                                </div> }
                            {item.subsId === 15212 || item.subsId === 15214 || item.subsId === 15210 ? <div className="hd-count">{this.getHDCount()} в HD</div> : null}
                        </div>
                        <div className="bundle-descr">
                            {item.description}
                        </div>
                        <div className="bundle-content">
                            {map(item.channels, id => {
                                const channel = channels[id];
                                return channel ? <div key={id} className="channel-poster" style={{ backgroundImage: 'url(' + channel.poster + ')' }}></div> : null;
                            })}
                        </div>
                        <div className="tac">
                            <Button isDefault title={t('Close')} customClassName="bundle-modal-close" onClick={() => this.props.onClick(item.subsId, 'remove')}/>
                        </div>
                        {item.specialOfferId ? <div className="special-offers-docs container">
                            <div>{specialOffers[item.specialOfferId + '']} {t('There are special conditions')}. <a href={'http://i.ollcdn.net/current/documents/' + item.specialOfferId + '.pdf'} rel="noopener noreferrer"  target="_blank" className="link"> {t('More details')}</a>.</div>
                        </div> : null}
                    </div>

                </div>

            </div>
        );
    }
}
