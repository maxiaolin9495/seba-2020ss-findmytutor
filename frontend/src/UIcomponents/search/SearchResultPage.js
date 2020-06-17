import React, { Component } from 'react';
import { Checkbox, Button, Divider, TextField } from 'react-md';
import { createHashHistory } from 'history'
import { withRouter } from "react-router-dom";
import SearchResultCard from "./SearchResultCard";
// export const history = createHashHistory();

// const universities = {
//     university: [],
// }

// const prices = {
//     Price: []
// }


class SearchResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards:[]
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            cards: props.filteredData.map(d => {
                console.log(d);
                return(<SearchResultCard
                    key={d.id}
                    tutor={d} />)
            })
        })
    }
    renderCards = () => {
        this.props.data.map(d => {
            return (<SearchResultCard
                key={d.id}
                tutor={d} />
            )
        })
    }

    render() {
        return (<div>
            {this.state.cards}
        </div>);
    }
}

export default withRouter(SearchResultPage);