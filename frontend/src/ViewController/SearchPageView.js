"use strict";

import React from 'react';
import Background from '../Images/Homepage.jpg';//https://www.umc.edu/Research/Centers-and-Institutes/Centers/Center-for-Informatics-and-Analytics/Center-for-Informatics-and-Analytics-Home.html
import SearchBarComponent from "../UIcomponents/Search/SearchBarComponent";
import '../UIcomponents/Search/SearchPage.css';
import Navigation from "../UIcomponents/PageDesign/Navigation";
import UserService from "../Services/UserService";

export class SearchPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    componentWillMount() {
        UserService.getCurrentUser().userType === 'tutor' && this.props.history.push("/booking");
    }


    render() {
        return (
            <div>
                <Navigation />

                <section>
                    <div className="md-grid" style={{ marginTop: "20%", marginLeft: "0%" }}>

                        {<SearchBarComponent />}

                    </div>
                    <img src={Background} alt={"A Background Picture"} className="bg" />


                </section>
            </div>
        )
    }

}
