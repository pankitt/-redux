import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
const modalRoot = document.getElementById('modal');

export default class Modal extends Component {
    static propTypes = {
        children: PropTypes.node,
        origin: PropTypes.object,
        transform: PropTypes.bool,
        onClose: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.closeBtn =  document.createElement('div');
        this.closeBtn.classList = 'close-btn';
        this.el.appendChild(this.closeBtn);
    }

    _handleCloseButtonClick = () => {
        this.props.onClose();
    }

    componentDidMount() {
        const { origin, transform } = this.props;
        modalRoot.appendChild(this.el);
        this.closeBtn.addEventListener('click', this._handleCloseButtonClick);
        if (transform) this.el.classList = 'enter';
        setTimeout(() => {
            document.body.style.overflow = 'hidden';
        }, 100);
        this.el.style.transformOrigin =  origin.x + 'px ' + origin.y + 'px 0px';
    }

    componentWillUnmount() {
        setTimeout(() => {
            modalRoot.removeChild(this.el);
        }, 500);
        this.el.classList = 'leave';
        this.closeBtn.removeEventListener('click', this._handleCloseButtonClick);
        document.body.style.overflow = 'auto';
    }

    render() {
        if (this.props.children) {
            return ReactDOM.createPortal(
                this.props.children,
                this.el,
            );
        }
    }
}
