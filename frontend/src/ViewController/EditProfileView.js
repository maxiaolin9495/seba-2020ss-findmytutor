"use strict";

import React from 'react';

import EditProfile from './../UIcomponents/pageDesign/EditProfile';
import Navigation from "../UIcomponents/pageDesign/Navigation";
import Background from '../Images/Homepage.jpg';

// import EditProfileService from '../services/EditProfileService';


export class EditProfileView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount(){
        this.setState({
            loading: true,
            error: undefined
        });

        // let id = this.props.match.params.id;

        // EditProfileService.getMovie(id).then((data) => {
        //     this.setState({
        //         movie: data,
        //         loading: false,
        //         error: undefined
        //     });
        // }).catch((e) => {
        //     console.error(e);
        // });
        // TODO: get profile with http service
        this.setState({
            userProfile: {
                firstName: "Li",
                lastName: "Li",
                email: "0.1@cc.cc",
                university: "TUM",
                price: "15.55",
                description: "123Test"
            },
            loading: false
        })
    }

    updateProfile = (movie) => {
        // EditProfileService.updateProfile(movie).then((data) => {
        //     console.log(data)
        // }).catch((e) => {
        //     console.error(e);
        //     this.setState({
        //         error: 'Error while creating movie'
        //     });
        // });
    }

    render() {
        if (this.state.loading) {
            return (<h2>Loading...</h2>);
        }

        return (<div>
            <Navigation/>
            <section>
                <img src={Background} alt={"Ein Hintergrundbild"} className="bg"/>
                <EditProfile userProfile={this.state.userProfile} onSubmit={(userProfile) => this.updateProfile(userProfile)} error={this.state.error} />

                <div style={{marginTop: '25%', position: 'relative'}}>
                </div>

            </section>
        </div>);
    }
}
