import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPage } from '../actions/pages';
import map from 'lodash/map';

class Help extends Component {
    static propTypes = {
        topic: PropTypes.string,
        pages: PropTypes.object,
        history: PropTypes.object,
        getPage: PropTypes.func,
        location: PropTypes.object,
    };

    setMeta() {
        document.title = this.props.pages.help.title;
    }

    componentDidMount() {
        const { pages, getPage } = this.props;
        if (!pages.help) {
            getPage('help');
        } else {
            this.setMeta();
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.pages.help && this.props.pages.help) {
            this.setMeta();
        }
        if (this.props.location.pathname !== '/help') {
            this.props.history.push('/help' + this.props.location.hash);
        }
    }

    getFromHTML(html, mask) { // THIS SHOULD BE REMOVED AFTER SERVER'S PROPER RESPONSE
        let str = html.replace(' #DISPLAY#', '');
        let [open, close] = mask.split('|');
        let start = str.indexOf(open);
        let end = str.indexOf(close);
        return str.slice(start + open.length, end);
    }

    createMenu(children) { // THIS SHIT NEEDS REFACTOR
        return map(children, el => {
            const elements = [];
            if (el.title) {
                elements.push(
                    <h2>{el.title}</h2>
                );
            }
            if (el.children) {
                let list = map(el.children, child => {
                    let id = this.getFromHTML(child.html, '<section id="|">');
                    let title = this.getFromHTML(child.html, '<h1>|</h1>');
                    return (<li><a href={'#' + id}>{title}</a></li>);
                });
                elements.push(<ul>{list}</ul>);
            }
            return elements;
        });
    }

    createElement(children) {
        return map(children, el => {
            const elements = [];
            // if (el.title) {
            //     elements.push(
            //         <h2>{el.title}</h2>
            //     );
            // }
            if (el.children) {
                elements.push(
                    this.createElement(el.children)
                );
            }
            if (el.html) {
                let id = this.getFromHTML(el.html, '<section id="|">');
                elements.push(<a className="hidden" name={id}></a>);
                elements.push(
                    <div dangerouslySetInnerHTML={{ __html: el.html }} />
                );
            }
            return elements;
        });
    }

    render() {
        const { pages: { help } } = this.props;
        if (!help) return null;
        return (
            <div className="page-help container">
                <div className="help-menu-holder">
                    <div className="help-menu">
                        {this.createMenu(help.children)}
                    </div>
                </div>
                <div className="help-content">
                    {this.createElement(help.children)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        topic: ownProps.match.params.topic,
        pages: state.pages || {},
    };
};

export default connect(mapStateToProps, { getPage })(Help);
