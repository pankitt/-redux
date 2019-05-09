import React, {Component} from 'react';
import {fetchBroadcastTeasers} from '../api/broadcastTeasersApi';

// specially separately
import store from '../store'
const getStore = store.getState();
//

console.log(getStore);

class Teaser extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: null
        }
    }

    async componentDidMount() {
        const data = await fetchBroadcastTeasers();
        this.setState({data})
    }


    render() {
        return (
            <section>
                {this.state.data ? this.state.data.storage.map(item => <div>{item.image}</div>) : null}
                <h1>Teaser</h1>
                <div className='ukraine'/>
            </section>
        )
    }
}

export default Teaser;