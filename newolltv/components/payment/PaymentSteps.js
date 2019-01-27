import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../i18n';

export default class PaymentSteps extends Component {
    static propTypes = {
        activeStep: PropTypes.number,
        withSecondStep: PropTypes.bool,
    }

    render() {
        const { activeStep, withSecondStep } = this.props;
        const isActiveFirstStep = activeStep === 1 ? 'active' : '',
            isActiveSecondStep = activeStep === 2 ? 'active' : '',
            isActiveThirdStep = activeStep === 3 ? 'active' : '';

        return (
            <div className="payment-header-steps">
                <div className={'step step-1 ' + isActiveFirstStep}>{t('Select period')}</div>
                {withSecondStep ? <div className={'step step-2 new ' + isActiveSecondStep}>{t('Payment')}</div> : null}
                <div className={'step step-3 ' + isActiveThirdStep}>{t('Done')}</div>
            </div>
        );
    }
}
