"use strict";

import React from 'react';
import { Card, Button, FontIcon, TextField } from 'react-md';
import { withRouter } from 'react-router-dom'


const style = { maxWidth: 500,
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
                courses: props.userProfile.courses
            }
        } else {
            this.state = {
                firstName: '',
                lastName: '',
                email: '',
                university: '',
                price: '',
                description: ''
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
        userProfile.price = this.state.price;
        userProfile.description = this.state.description;

        // onsubmit defined by EditProfileView
        this.props.onSubmit(userProfile);
    }

    // onReset={() => this.props.history.goBack()}
    // onChange={this.handleChangeEmail}
    render() {
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
                        errorText="First name is required" />
                    <TextField
                        label="LastName"
                        id="LastNameField"
                        type="text"
                        className="md-row"
                        required={true}
                        value={this.state.lastName}
                        onChange={this.handleChangeLastName}
                        errorText="Last name is required"
                        maxLength={20} />
                    <TextField
                        label="email"
                        id="emailField"
                        type="text"
                        className="md-row"
                        active={false}
                        required={false}
                        defaultValue={this.state.email} />
                    <TextField
                        label="University"
                        id="UniversityField"
                        type="text"
                        className="md-row"
                        required={true}
                        value={this.state.university}
                        onChange={this.handleChangeUniversity}
                        errorText="University is required" />
                    <TextField
                        label="price"
                        id="PriceLabel"
                        type="number"
                        className="md-row"
                        required={true}
                        value={this.state.price}
                        onChange={value => this.handleChangePrice(value)}
                        errorText="Price is required" />
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
                        errorText="Description is required" />

                    <Button id="submit" type="submit"
                        disabled={!this.state.firstName || !this.state.lastName || !this.state.email || !this.state.university || !this.state.price || !this.state.description}
                        raised primary className="md-cell md-cell--2">Save</Button>
                    <Button id="reset" type="reset" raised secondary className="md-cell md-cell--2">Dismiss</Button>
                </form>
            </Card>
        );
    }
}

export default withRouter(EditProfile);