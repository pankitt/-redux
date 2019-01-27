import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../Button';
import { submitPromo, changePromo, undoPromo } from '../../actions/promo';
import t from '../../i18n';
import forEach from 'lodash/forEach';

class PromoCode extends Component {
    static propTypes = {
        isLoading: PropTypes.bool,
        payment: PropTypes.object,
        subs: PropTypes.object,
        submitPromo: PropTypes.func,
        changePromo: PropTypes.func,
        undoPromo: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            ids: this.getAllSubs(),
        };
    }
    getAllSubs = () => {
        const { subs } = this.props;
        let ids = [];
        forEach(subs, sub => {
            forEach(sub.tariffs, (sub, id) => {
                ids.push(id);
            });
        });
        return ids;
    }

    submit = () => {
        const { payment: { promoCode: { value, error } }, submitPromo } = this.props;
        if (!!value.length && !error) {
            submitPromo(value, this.state.ids);
        }
    }

    handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.submit();
        }
    }

    handlePromoChange = () => {
        this.props.changePromo(this.input.value);
    }

    render() {
        const { payment: { discount, promoCode: { error, value, isLoading } }  } = this.props;
        let discountValue = discount && discount.value ? discount.value + '%' : '',
            fixedValue = discount && discount.fixed ? discount.fixed + t('hrn') : '';

        return (
            !discount ? <div className="promo-code-wrapper">
                <div className="promo-code">
                    <div className="promo-text">{t('I have a promo code')}:</div>
                    <div className="promo-input">
                        <input className={error && !!value.length ? 'error' : ''}
                            onChange={this.handlePromoChange}
                            type="text"
                            ref={el => this.input = el}
                            value={value}
                            onKeyPress={this.handleKeyPress}/>
                    </div>
                    <Button isDefault isSmall title={t('Use')} onClick={this.submit}/>
                </div>
                {error && !isLoading && !!value.length ? <div className="error">{error.message}</div> : null}
            </div> : <div className="discount tac">
                <div className="discount-value">{t('Your discount') + ' — ' + (discount.value ? discountValue : fixedValue)}</div>
                <div className="discount-info" dangerouslySetInnerHTML={{ __html: discount.discountInfo }}></div>
                <Button isSmall notTransparent title={t('Cancel')} onClick={this.props.undoPromo}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        payment: state.payment,
    };
};

export default connect(mapStateToProps, { submitPromo, changePromo, undoPromo })(PromoCode);
