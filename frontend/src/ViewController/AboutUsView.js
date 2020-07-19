import React from 'react';
import AboutUs from '../UIcomponents/PageDesign/AboutUs';
import Background from "../Images/Homepage.jpg";
import Navigation from "../UIcomponents/PageDesign/Navigation";

export class AboutUsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
        };
    }

    render() {
        setTimeout(() => window.scrollTo(0, 0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                    <img src={Background} alt={"A Background Picture"} className="bg"/>
                    <AboutUs/>
                </section>
            </div>
        );
    }
}