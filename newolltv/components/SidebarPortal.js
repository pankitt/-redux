import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
const portalRoot = document.getElementById('sidebar-portal');

export default class Modal extends Component {
    static propTypes = {
        children: PropTypes.node,
        fullScreen: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        if (!this.props.fullScreen) {
            this.el = document.createElement('div');
            portalRoot.appendChild(this.el);
        }
    }

    componentWillUnmount() {
        if (this.el) {
            portalRoot.removeChild(this.el);
        }
    }

    render() {
        if (this.props.children) {
            if (this.props.fullScreen) {
                return this.props.children;
            }

            return ReactDOM.createPortal(
                this.props.children,
                this.el,
            );
        }
        return null;
    }
}
