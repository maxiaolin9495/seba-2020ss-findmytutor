"use strict";

import React from 'react';
import Background from '../Images/Homepage.jpg';//https://www.umc.edu/Research/Centers-and-Institutes/Centers/Center-for-Informatics-and-Analytics/Center-for-Informatics-and-Analytics-Home.html
import SearchBarComponent from "../UIcomponents/search/SearchBarComponent";
import '../css/bg.css';
import {Button} from 'react-md';

export class SearchPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    searchBySearchBar = () => {
        if (this.state.searchValue === 'city') {
            alert('Please input a city name');
            return;
        }
        this.props.history.push(`/searchresult?query=${this.state.searchValue}`)
    };

    render() {
        return (
            <section>
                <div style={{marginTop: '20%', position: 'relative', marginLeft: '35%'}}>
                    <div className="md-grid" style={{verticalAlign: 'bottom'}}>

                        {<SearchBarComponent/>}
                        <Button raised primary swapTheming style={{
                            height: '53.63px',
                            fontSize: '15px',
                            background: 'blue',
                            color: 'white',
                            marginTop: '8px'
                        }} onClick={() => this.searchBySearchBar()}
                        >Search</Button>
                    </div>
                </div>
                <img src={Background} alt={"A Background Picture"} className="bg"/>


            </section>
        )
    }

}
