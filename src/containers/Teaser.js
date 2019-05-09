import React, {Component} from 'react';
import {fetchBroadcastTeasers} from '../api/broadcastTeasersApi';

// specially separately
// import store from '../store'
// const getStore = store.getState();
//

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
                <h1>Teaser</h1>
                {this.state.data ? this.state.data.storage.map((item, i) =>
                        <div className='ukraine' key={i}>
                            <img alt="img" src={item.images.standard} />
                        </div>) : null}
            </section>
        )
    }
}

export default Teaser;