import React, {Component} from 'react';
import {Checkbox, Button, Divider, TextField} from 'react-md';
import { createHashHistory } from 'history'
import {withRouter} from "react-router-dom";
export const history = createHashHistory();

const universities = {
    university: [],
}

const prices = {
    Price: []
}

class SearchResultPage extends Component {

    searchBySearchBar =() =>{
        if(this.state.searchValue === '') {
            alert('Please input a city name');
            return;
        }
        this.props.history.push(`/searchresult?query=${this.state.searchValue}`);
        window.location.reload();
    }
}

export default withRouter(SearchResultPage);