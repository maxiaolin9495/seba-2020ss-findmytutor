"use strict";

import React from 'react';
import Background from '../Images/Homepage.jpg';//https://www.umc.edu/Research/Centers-and-Institutes/Centers/Center-for-Informatics-and-Analytics/Center-for-Informatics-and-Analytics-Home.html
import SearchBarComponent from "../UIcomponents/search/SearchBarComponent";
import '../css/bg.css';
import Navigation from "../UIcomponents/pageDesign/Navigation";
import {Button} from 'react-md';
import { toast } from 'react-toastify';

export class SearchPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }



    render() {
        return <div>
            <Navigation />
            <section>
                <div className="md-grid md-block-centered" style={{marginTop:"20%",marginLeft:"20%"}}>

                        {<SearchBarComponent />}
                   
                </div>
                <img src={Background} alt={"A Background Picture"} className="bg" />



            </section>
        </div>
    }

}
