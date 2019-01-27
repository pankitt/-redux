import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPage } from '../actions/pages';

class StaticPage extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        getPage: PropTypes.func.isRequired,
        pages: PropTypes.object.isRequired,
    };

    setMeta() {
        document.title = this.props.pages[this.props.id].title;
    }

    componentDidMount() {
        const { pages, id, getPage } = this.props;
        if (!pages[id]) {
            getPage(id);
        } else {
            this.setMeta();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id || prevProps.pages[prevProps.id] !== this.props.pages[this.props.id] && this.props.pages[this.props.id]) {
            this.setMeta();
        }
    }

    createElement(page) {
        let elements = [];
        if (page.title) {
            elements.push(<h1>{page.title}</h1>);
        }
        if (page.html) {
            elements.push(<div dangerouslySetInnerHTML={{ __html: page.html }} />);
        }
        return elements;
    }

    render() {
        const { pages, id } = this.props;
        if (!pages[id]) {
            return null;
        }
        return (
            <div className={'page-static container ' + id}>
                {this.createElement(pages[id])}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        id: ownProps.id,
        pages: state.pages || {},
    };
};

export default connect(mapStateToProps, { getPage })(StaticPage);
