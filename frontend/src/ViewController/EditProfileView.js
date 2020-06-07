"use strict";

import React from 'react';

import EditProfile from './../UIcomponents/pageDesign/EditProfile';
import Navigation from "../UIcomponents/pageDesign/Navigation";
import Background from '../Images/Homepage.jpg';

import UserService from '../Services/UserService';
import EditProfileService from '../Services/EditProfileService';


export class EditProfileView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: undefined
        };
    }

    componentDidMount() {
        // let user = UserService.getCurrentUser()

        // if (!user || Object.keys(obj).length === 0) {
        //     user = {
        //         email: '123',
        //         userType: 'tutor'
        //     }
        // }

        // TODO: get customer profile
        EditProfileService.getTutorProfile().then((data) => {
            this.setState({
                userProfile: data,
                loading: false,
                error: undefined
            });
        }).catch((e) => {
            console.error(e);
        });
    }

    updateProfile = (userProfile) => {
        EditProfileService.updateTutorProfile(userProfile).then((data) => {
            console.log(data)
        }).catch((e) => {
            console.error(e);
            this.setState({
                error: 'Error while updating user profile'
            });
        });
    }

    render() {
        if (this.state.loading) {
            return (<h2>Loading...</h2>);
        }

        return (<div>
            <Navigation />
            <section>
                <img src={Background} alt={"Ein Hintergrundbild"} className="bg" />
                <EditProfile userProfile={this.state.userProfile} onSubmit={(userProfile) => this.updateProfile(userProfile)} error={this.state.error} />

                <div style={{ marginTop: '25%', position: 'relative' }}>
                </div>

            </section>
        </div>);
    }
}
