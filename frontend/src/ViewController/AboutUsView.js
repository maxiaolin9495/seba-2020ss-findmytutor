import React from 'react';
import AboutUs from '../UIcomponents/pageDesign/AboutUs';
import Navigation from "../UIcomponents/pageDesign/Navigation";
import Background from "../Images/Homepage.jpg";

export class AboutUsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
        };
    }

    render() {
        setTimeout(() => window.scrollTo(0,0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                    <img src={Background} alt={"Ein Hintergrundbild"} className="bg"/>
                    <AboutUs/>
                </section>
            </div>
        );
    }
}