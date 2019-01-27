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
    }


    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        setTimeout(() => {
            modalRoot.removeChild(this.el);
        }, 500);
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
