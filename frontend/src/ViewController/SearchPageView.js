"use strict";

import React from 'react';
import Background from '../Images/Homepage.jpg';
import '../css/bg.css';
import Navigation from "../UIcomponents/pageDesign/Navigation";

export class SearchPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return <div>
            <Navigation/>
            <section>
                <img src={Background} alt={"A Background Picture"} className="bg"/>

                <div style={{marginTop: '25%', position: 'relative'}}>
                </div>

            </section>
        </div>
    }

}
