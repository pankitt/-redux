import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CarouselItemMain from './CarouselItemMain';
import { getPostersItems } from '../../actions/posters';
import Swipeable from 'react-swipeable';

class CarouselMain extends Component {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                title: PropTypes.string.isRequired,
                subtitle: PropTypes.string,
                url: PropTypes.string.isrequired,
            })
        ).isRequired,
        getPostersItems: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 0,
            offsetWidth: 0,
            numberOfItems: 0,
            isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
        };
    }

    componentDidMount() {
        this.props.getPostersItems().then(() => {
            this.setState({
                offsetWidth: this.wrapper.offsetWidth,
                numberOfItems: this.props.items.length,
            });
        });
    }

    prev = () => {
        let newActiveItem = this.state.activeItem;
        if (newActiveItem > 1) {
            newActiveItem -= 1;
        } else {
            newActiveItem = 0;
        }
        this.setState({
            offsetWidth: this.wrapper.offsetWidth,
            activeItem: newActiveItem,
        });
    }

    next = () => {
        let newActiveItem = this.state.activeItem;
        if (newActiveItem < this.state.numberOfItems - 1) {
            newActiveItem += 1;
        } else {
            newActiveItem = this.state.numberOfItems - 1;
        }
        this.setState({
            offsetWidth: this.wrapper.offsetWidth,
            activeItem: newActiveItem,
        });
    }

    _handleArrowClick = (arrow) => {
        if (arrow === 'l') {
            this.prev();
        } else if (arrow === 'r') {
            this.next();
        }
    }

    render() {
        const { items } = this.props;
        return (
            <div className="carousel main">
                <Swipeable onSwipedLeft={this.next} onSwipedRight={this.prev} preventDefaultTouchmoveEvent={true}>
                    <div className="carousel-wrapper" ref={el => this.wrapper = el}>
                        <div className="carousel-items" style={{ transform: 'translateX(-' + (this.state.activeItem * this.state.offsetWidth) + 'px)' }}>
                            {items.map((item, i) => <CarouselItemMain {...item} key={i} />)}
                        </div>
                        {!this.state.isTouch ? <div className="carousel-arrows">
                            {this.state.activeItem > 0 && <div className="carousel-arrow left" onClick={() => this._handleArrowClick('l')}/>}
                            {this.state.activeItem < items.length - 1 && <div className="carousel-arrow right" onClick={() => this._handleArrowClick('r')}/>}
                        </div> : null }
                        <div className="dots">
                            {items.map((item, i) => {
                                const isActiveClassName = i === this.state.activeItem ? ' active' : '';
                                return <div className={'dot ' + isActiveClassName} key={i} />;
                            })}
                        </div>
                    </div>
                </Swipeable>
            </div>
        );
    }
}

export default connect(
    (state) => {
        return {
            items: state.posters.items,
        };
    }, { getPostersItems })(CarouselMain);
