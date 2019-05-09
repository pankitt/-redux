import React, {Component} from 'react';
// import {fetchBroadcastTeasers} from '../api/broadcastTeasersApi';
// import {getBroadcastTeasers} from '../actions/broadcastTeasers';

// specially separately
import { createStore } from 'redux';
import todoApp from '../reducers'
const store = createStore(todoApp);
const getStore = store.getState();
//

console.log(getStore);

class Bets extends Component {
    render() {
        return (
            <section>
                <h1>Teaser</h1>
                <div className='ukraine'/>
            </section>
        )
    }
}

export default Bets;