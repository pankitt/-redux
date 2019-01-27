import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSearchSuggest, getSearch, clearSearch } from '../../actions/search';
import map from 'lodash/map';
// import uniq from 'lodash/uniq';

class SearchInput extends Component {
    static propTypes = {
        getSearchSuggest: PropTypes.func,
        getSearch: PropTypes.func,
        clearSearch: PropTypes.func,
        history: PropTypes.object,
        location: PropTypes.object,
        search: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            focusItem: null,
            suggestions: null,
            userQuery: decodeURI(props.location.search.substring(1)),
            selectedQuery: '',
        };
    }

    componentWillUnmount() {
        // this.props.clearSearch();
    }

    componentDidUpdate(prevProps) {
        const { search: { suggestions } } = this.props;
        if ((prevProps.search.suggestions !== suggestions)) {
            this.setState({ suggestions: this.props.search.suggestions });
        }
        if (prevProps.location.search !== this.props.location.search) {
            this.setState({ userQuery: decodeURI(this.props.location.search.substring(1)) });
        }
    }

    componentDidMount() {
        if (this.state.userQuery.length && this.state.userQuery !== this.props.search.query) {
            this.search();
            this.props.getSearchSuggest(this.state.userQuery);
        }
        if (this.state.userQuery.length === 0) {
            this.props.clearSearch();
            this.input.focus();
        }
    }

    handleInputChange = (valueFromInput) => {
        const value = valueFromInput.replace(/\s\s+/g, ' ');
        if (value !== this.state.userQuery && value.indexOf('%') === -1 && value.length <= 30 && value[0] !== ' ') {
            clearTimeout(this.timeout);
            this.setState({ selectedQuery: null, focusItem: null });
            this.updateLocation(value);
            this.props.getSearchSuggest(value);
            this.timeout = setTimeout(() => {
                if (value.length) {
                    this.search();
                } else {
                    this.props.clearSearch();
                }
            }, 500);
        }
    }

    updateLocation = (query) => {
        if (query.length) {
            this.props.history.replace(this.props.location.pathname + '?' + query);
        } else {
            this.props.history.replace(this.props.location.pathname);
        }
    }

    handleMouseEnter = (focusItem) => {
        this.setState({ focusItem });
    }

    handleMouseLeave = () => {
        this.setState({ focusItem: null });
    }

    handleFocus = () => {
        this.setState({ inputOnFocus: true });
    }

    handleBlur = () => {
        setTimeout(() => {
            this.setState({ inputOnFocus: false });
        }, 100);
    }

    handleClearBtnClick = () => {
        if (this.state.userQuery.length) {
            this.updateLocation('');
            this.props.clearSearch();
            this.input.focus();
        }
    }

    chooseSuggest = (item) => {
        this.handleInputChange(item);
        this.setState({ userQuery: item, suggestions: null }, () => this.search());
    }

    search = () => {
        if (!this.props.search.isLoading) {
            this.props.getSearch(this.state.userQuery);
        }
    }

    selectSuggest = (suggest) => {
        this.setState({
            focusItem: suggest,
            selectedQuery: suggest,
        });
    }

    handleKeyPress = (e) => {
        const { suggestions, focusItem } = this.state;
        let nextFocusItem = '';

        if (e.key === 'Enter') {
            if (focusItem) {
                this.chooseSuggest(focusItem);
            } else if (this.state.userQuery !== this.props.search.query) {
                this.search();
                this.input.blur();
            } else {
                this.input.blur();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestions.length) {
                if (focusItem) {
                    const focusIndex = suggestions.indexOf(focusItem);
                    if (focusIndex < suggestions.length - 1) {
                        nextFocusItem = suggestions[focusIndex + 1];
                    } else {
                        // nextFocusItem = suggestions[0];
                        nextFocusItem = null;
                    }
                } else {
                    nextFocusItem = suggestions[0];
                }
                this.selectSuggest(nextFocusItem);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestions.length) {
                if (focusItem) {
                    const focusIndex = suggestions.indexOf(focusItem);
                    if (focusIndex > 0) {
                        nextFocusItem = suggestions[focusIndex - 1];
                    } else {
                        // nextFocusItem = suggestions[suggestions.length - 1];
                        nextFocusItem = null;
                    }
                } else {
                    nextFocusItem = suggestions[suggestions.length - 1];
                }
                this.selectSuggest(nextFocusItem);
            }
        }
    }

    render() {
        const { search } = this.props;

        const { focusItem, suggestions, userQuery, selectedQuery, inputOnFocus } = this.state;

        const inputValue = selectedQuery ? selectedQuery : userQuery;

        return <div className="search-input">
            <div className="input-block">
                <input type="search" onChange={() => this.handleInputChange(this.input.value)} ref={el => this.input = el} value={inputValue} onKeyDown={this.handleKeyPress} onFocus={this.handleFocus} onBlur={this.handleBlur}/>
                {search.isLoading ? <div className="loading"></div> : null}
                <div className="clear-btn" onClick={this.handleClearBtnClick}></div>
                {inputOnFocus && suggestions && userQuery ? <div className="search-suggestions">
                    <ul>
                        {map(suggestions, (item, key) => {
                            const focusClassName = item === focusItem ? 'focus' : '';
                            const isUserValueClassName = item === userQuery ? 'user-value' : '';

                            return (
                                <li key={key} className={focusClassName + ' ' + isUserValueClassName}
                                    onMouseEnter={() => this.handleMouseEnter(item)}
                                    onMouseLeave={this.handleMouseLeave}
                                    onClick={() => this.chooseSuggest(item)}
                                >
                                    {item}
                                </li>
                            );
                        })}
                    </ul>
                </div> : null}

            </div>
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        search: state.search,
    };
};

export default connect(mapStateToProps, { getSearchSuggest, getSearch, clearSearch })(SearchInput);
