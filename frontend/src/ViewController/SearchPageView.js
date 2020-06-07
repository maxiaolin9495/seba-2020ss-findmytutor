"use strict";

import React from 'react';
import Background from '../Images/Homepage.jpg';//https://www.umc.edu/Research/Centers-and-Institutes/Centers/Center-for-Informatics-and-Analytics/Center-for-Informatics-and-Analytics-Home.html
import '../css/bg.css';
import Navigation from "../UIcomponents/pageDesign/Navigation";
import UserService from '../Services/UserService';

export class SearchPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    addProfile=(user)=>{
        UserService.addProfile(user).then((data) => {
            this.props.history.push('/');
        }).catch((e) => {
            console.error(e);
            this.setState({
                error: e
            });
        });
    };


    render() {
        return <div>
            <Navigation/>
            <section>
                <img src={Background} alt={"Ein Hintergrundbild"} className="bg"/>

                <div style={{marginTop: '25%', position: 'relative'}}>
                </div>

            </section>
        </div>
    }

}
