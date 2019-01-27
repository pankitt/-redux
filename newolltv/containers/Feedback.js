import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTopics, submit as submitFeedback } from '../actions/feedback';
import Dropdown from '../components/DropDown';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import t from '../i18n';
import { POPUP_MESSAGE_SENT } from '../constants';
import { showSignPopup } from '../actions/sign';

class Feedback extends Component {
    static propTypes = {
        feedback: PropTypes.object,
        getTopics: PropTypes.func,
        submitFeedback: PropTypes.func,
        showSignPopup: PropTypes.func,
        history: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            question: '',
            topics: [],
            error: false,
        };
    }

    componentDidMount() {
        const { feedback, getTopics } = this.props;
        if (!feedback.token) {
            getTopics();
        }
    }

    handleChangeValue(i, value) {
        this.setState({ topics: [ ...this.state.topics.slice(0, i), value ] });
    }

    handleChangeInput = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        let valid = true;
        e.preventDefault();
        forEach(['name', 'email', 'topics', 'question'], key => {
            if (!this.state[key].length) {
                valid = false;
                this.setState({ error: true });
            }
        });

        if (valid) {
            // FIXME: что-то я перемудрил )))
            const buildParams = (result, list, prefix) => {
                for (let i = 0; i < list.length; ++i) {
                    const key = prefix + '[' + list[i].id + ']';
                    if (Array.isArray(list[i].value)) {
                        buildParams(result, list[i].value, key);
                    } else {
                        result[key] = list[i].value; // eslint-disable-line
                    }
                }
                return result;
            };
            const params = {
                name: this.state.name,
                email: this.state.email,
                question: this.state.question,
                token: this.props.feedback.token,
                topic: this.state.topics.shift().id, // remove first
            };
            if (this.state.topics.length) {
                forEach(buildParams({}, this.state.topics, 'info'), (value, key) => {
                    params[key] = value;
                });
            }
            this.props.submitFeedback(params);
            this.props.showSignPopup(POPUP_MESSAGE_SENT);
            this.props.history.push('/');
        }
    };

    showError() {
        const name = this.state.name ? '' : `${t('Name')}; `;
        const email = this.state.email ? '' : `${t('E-mail ')}; `;
        const question = this.state.question ? '' : `${t('Question')}; `;
        const topics = this.state.topics.length ? '' : `${t('Cause of treatment')}; `;
        const begin = (name || email || question || topics) ? `${t('Please specify')}: ` : '';

        return begin + name + email + question + topics;
    }

    createElements(result, i, el) {
        let next, active;
        switch (el.type) {
            case 'select':
                result.push(
                    <div className="form-group" key={el.id}>
                        <Dropdown items={map(el.items, item => item.title)} changeActive={key => this.handleChangeValue(i, { id: el.items[key].id, value: 1 })} customClassName={''}/>
                    </div>
                );
                active = this.state.topics[i] || {};
                next = find(el.items, item => item.id === active.id);
                if (next && next.items) {
                    return this.createElements(result, i + 1, next);
                }
                break;
            case 'text':
                result.push(
                    <div className="form-group" key={el.id}>
                        {map(el.items, item => <div dangerouslySetInnerHTML={{ __html: item.title }} />)}
                    </div>
                );
                break;
            case 'input':
                active = this.state.topics[i - 1] || {};
                result.push(
                    map(el.items, item => {
                        return (
                            <div className="form-group" key={item.id}>
                                <label htmlFor={item.id}>{item.title}</label>
                                <input type="text" id={item.id} onChange={e => {
                                    const list = filter(active.value, value => {
                                        // console.log(value, item);
                                        return value.id !== item.id;
                                    });
                                    if (e.target.value) {
                                        list.push({ id: item.id, value: e.target.value });
                                    }
                                    this.handleChangeValue(i - 1, { id: el.id, value: list });
                                }} required />
                            </div>
                        );
                    })
                );
                break;
            case 'checkbox':
            case 'checkboxgroup':
                active = this.state.topics[i - 1] || {};
                result.push(
                    map(el.items, item => {
                        return (
                            <div className="form-group" key={item.id}>
                                <input id={item.id} type="checkbox" onChange={e => {
                                    const list = filter(active.value, value => {
                                        // console.log(value, item);
                                        return value.id !== item.id;
                                    });
                                    if (e.target.checked) {
                                        list.push({ id: item.id, value: 1 });
                                    }
                                    this.handleChangeValue(i - 1, { id: el.id, value: list });
                                }}/>
                                <label htmlFor={item.id}>{item.title}</label>
                            </div>
                        );
                    })
                );
                break;
            default:
                // TODO: other types
                console.log(el);
        }
        return result;
    }

    render() {
        const { feedback } = this.props;
        if (!feedback.token) {
            return null;
        }
        return (
            <div className="page-feedback">
                <h3 className="title">{t('Feedback')}</h3>
                <div className="subtext">
                    {t('Your request will be sent to the support team.')}
                    <br/>
                    {t('We will do our best to answer you as quickly as possible.')}
                </div>
                <br/>
                <form onSubmit={this.handleSubmit} noValidate>
                    <div className="form-group input-block">
                        <label htmlFor="name">{t('Name')}</label>
                        <input type="text" id="name" name="name" value={this.state.name} onChange={this.handleChangeInput} required />
                    </div>
                    <div className="form-group input-block">
                        <label htmlFor="email">{t('E-mail')}</label>
                        <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleChangeInput} required />
                    </div>
                    <div className="form-group input-block">
                        {this.createElements([], 0, { items: feedback.items, type: 'select' })}
                    </div>
                    <div className="form-group input-block">
                        <label htmlFor="question">{t('Question')}</label>
                        <textarea id="question" rows="12" name="question" value={this.state.question} onChange={this.handleChangeInput} required />
                    </div>
                    <div className="form-group error-block">
                        {this.state.error ? <div className="error">{this.showError()}</div> : null}
                    </div>
                    <div className="form-submit">
                        <button type="submit" className="btn primary">{t('Send')}</button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        feedback: state.feedback,
    };
};

export default connect(mapStateToProps, { getTopics, submitFeedback, showSignPopup })(Feedback);
