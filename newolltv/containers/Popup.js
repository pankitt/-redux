import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button';

class Popup extends Component {
    static propTypes = {
        customClassName: PropTypes.string,
        onClose: PropTypes.func.required,
        children: PropTypes.node,
        hideCloseBtn: PropTypes.bool,
        title: PropTypes.string,
        text: PropTypes.string,
        cancelBtnTitle: PropTypes.string,
        onCancel: PropTypes.func,
        submitBtnTitle: PropTypes.string,
        onSubmit: PropTypes.func,
    };

    render() {
        return (
            <div className="popup-base">
                <div className="popup-base-overlay" onClick={this.props.onClose} />
                <div className={'popup-base-body ' + this.props.customClassName || ''}>
                    <div style={{ position: 'relative' }}>
                        {this.props.hideCloseBtn ? null : <div className="popup-base-close-btn" onClick={this.props.onClose}/>}
                        {!this.props.title ? null : <div className="popup-base-title">{this.props.title}</div>}
                        {!this.props.text ? null : <div className="popup-base-text">{this.props.text}</div>}
                        {this.props.children}
                        <div className="popup-base-buttons">
                            {!this.props.cancelBtnTitle ? null : <Button title={this.props.cancelBtnTitle} isDefault sFluid onClick={this.props.onCancel || this.props.onClose} customClassName="popup-base-cancel"/>}
                            {!this.props.submitBtnTitle ? null : <Button title={this.props.submitBtnTitle} isPrimary isFluid onClick={this.props.onSubmit} customClassName="popup-base-submit"/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup;