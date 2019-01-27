import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

export default class Dropdown extends Component {
    static propTypes = {
        items: PropTypes.object,
        changeActive: PropTypes.func,
        customClassName: PropTypes.string,
    }

    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            isOpen: false,
            active: Object.keys(props.items)[0],
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (event) => {
        const { isOpen } = this.state;
        if ((!this.dropdown || !this.dropdown.contains(event.target))) {
            if (isOpen) {
                this.closeDropdown();
            }
        }
    }

    closeDropdown =() => {
        this.setState({ isOpen: false });
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    setActive = (key) => {
        this.setState({
            isActive: true,
            isOpen:false,
            active: key,
        }, () => this.props.changeActive(key));
    }

    render() {
        const { isOpen, active, isActive } = this.state;
        const { items, customClassName } = this.props;
        const isOpenClassName = isOpen ? 'open' : '';
        const activeLabel = isActive ? 'active' : '';
        return (
            <div className={'dropdown usn '  + isOpenClassName + ' ' + customClassName + ' ' + activeLabel} ref={el => this.dropdown = el}>
                <div className="label" onClick={this.toggle}>{items[active]}</div>
                {isOpen ? <div className="drop">
                    {map(items, (item, key) => {
                        const activeClassName = key === active ? 'active' : '';
                        return (
                            <div className={'drop-item ' + activeClassName} key={key} onClick={() => this.setActive(key)}>{item}</div>
                        );
                    })}
                </div> : null}
            </div>
        );
    }
}
