"use strict";

import React from 'react';
import {Card, Button, FontIcon, TextField} from 'react-md';
import {withRouter} from 'react-router-dom'
import TutorCalendar from "../TutorCalendar";
import {toast} from "react-toastify";


const style = {
    maxWidth: 750,
    opacity: 0.85,
};


class EditProfile extends React.Component {

    constructor(props) {
        super(props);

        if (this.props.userProfile != undefined) {
            this.state = {
                firstName: props.userProfile.firstName,
                lastName: props.userProfile.lastName,
                email: props.userProfile.email,
                university: props.userProfile.university,
                price: props.userProfile.price,
                description: props.userProfile.description,
                courses: props.userProfile.courses,
                timeSlotIds: props.userProfile.timeSlotIds
            }
        } else {
            this.state = {
                firstName: '',
                lastName: '',
                email: '',
                university: '',
                price: '',
                description: '',
                timeSlotIds: []
            }
            // TODO: add courses
        }
    }

    handleChangeFirstName = (firstName) => {
        this.setState({
            firstName
        })
    }

    handleChangeLastName = (lastName) => {
        this.setState({
            lastName
        })
    }

    handleChangeEmail = (email) => {
        this.setState({
            email
        })
    }

    handleChangeUniversity = (university) => {
        this.setState({
            university
        })
    }

    handleChangePrice = (price) => {
        // if(/\d+.\d{2}/.test(price))
        this.setState({
            price
        })
    }

    handleChangeDescription = (description) => {
        this.setState({
            description
        })
    }

    handleComingTimeSlots = (arr) => {
        this.setState({timeSlotIds: arr});
    }

    // TODO: change Avatar?

    handleSubmit = (event) => {
        event.preventDefault();

        let userProfile = this.props.userProfile;
        // TODO: change to not user profile
        if (userProfile == undefined) {
            userProfile = {};
        }

        userProfile.firstName = this.state.firstName;
        userProfile.lastName = this.state.lastName;
        userProfile.email = this.state.email;
        userProfile.university = this.state.university;
        if (this.props.userType === 'tutor') {
            userProfile.price = this.state.price;
            userProfile.description = this.state.description;
            userProfile.timeSlotIds = this.state.timeSlotIds;
        }

        // onsubmit defined by EditProfileView
        this.props.onSubmit(userProfile);
    }

    // onReset={() => this.props.history.goBack()}
    // onChange={this.handleChangeEmail}
    render() {
        if (this.props.userType === 'tutor') {
            return (
                <Card style={style} className="md-block-centered">
                    <form className="md-grid" onSubmit={this.handleSubmit} onReset={() => this.props.history.goBack()}>
                        <TextField
                            label="FirstName"
                            id="FirstNameField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.firstName}
                            onChange={this.handleChangeFirstName}
                            errorText="First name is required"/>
                        <TextField
                            label="LastName"
                            id="LastNameField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.lastName}
                            onChange={this.handleChangeLastName}
                            errorText="Last name is required"
                            maxLength={20}/>
                        <TextField
                            label="email"
                            id="emailField"
                            type="text"
                            className="md-row"
                            active={false}
                            required={false}
                            defaultValue={this.state.email}
                            disabled={true}/>
                        <TextField
                            label="University"
                            id="UniversityField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.university}
                            onChange={this.handleChangeUniversity}
                            errorText="University is required"/>
                        <TextField
                            label="price"
                            id="PriceLabel"
                            type="number"
                            className="md-row"
                            required={true}
                            value={this.state.price}
                            onChange={value => this.handleChangePrice(value)}
                            errorText="Price is required"/>
                        <TextField
                            label="Description"
                            id="DescriptionLabel"
                            type="text"
                            className="md-row"
                            required={true}
                            rows={5}
                            value={this.state.description}
                            onChange={value => this.handleChangeDescription(value)}
                            placeholder="Write some text to describe yourself"
                            errorText="Description is required"/>

                        <div>
                            <TutorCalendar
                                sendTimeSlots={this.handleComingTimeSlots}
                            />
                            <div>
                                <Button id="submit" type="submit"
                                        disabled={!this.state.firstName || !this.state.lastName || !this.state.email || !this.state.university || !this.state.price || !this.state.description}
                                        raised primary className="md-cell md-cell--2">Save</Button>
                                <Button id="reset" type="reset" raised secondary
                                        className="md-cell md-cell--2">Dismiss</Button>
                            </div>

                        </div>

                    </form>
                </Card>
            );
        } else if (this.props.userType === 'customer') {
            return (
                <Card style={style} className="md-block-centered">
                    <form className="md-grid" onSubmit={this.handleSubmit} onReset={() => this.props.history.goBack()}>
                        <TextField
                            label="FirstName"
                            id="FirstNameField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.firstName}
                            onChange={this.handleChangeFirstName}
                            errorText="First name is required"/>
                        <TextField
                            label="LastName"
                            id="LastNameField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.lastName}
                            onChange={this.handleChangeLastName}
                            errorText="Last name is required"
                            maxLength={20}/>
                        <TextField
                            label="email"
                            id="emailField"
                            type="text"
                            className="md-row"
                            active={false}
                            required={false}
                            defaultValue={this.state.email}
                            disabled={true}/>
                        <TextField
                            label="University"
                            id="UniversityField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.university}
                            onChange={this.handleChangeUniversity}
                            errorText="University is required"/>
                        <Button id="submit" type="submit"
                                disabled={!this.state.firstName || !this.state.lastName || !this.state.email || !this.state.university}
                                raised primary className="md-cell md-cell--2">Save</Button>
                        <Button id="reset" type="reset" raised secondary className="md-cell md-cell--2">Dismiss</Button>
                    </form>
                </Card>
            );
        }
    }
}

export default withRouter(EditProfile);