"use strict";

import React from 'react';
import { Card, Button, FontIcon, TextField, FileInput, Media, Cell } from 'react-md';
import { withRouter } from 'react-router-dom'
import TutorCalendar from "../Calendar/TutorCalendar";
import Resizer from 'react-image-file-resizer';


const style = {
    maxWidth: 750,
    opacity: 0.85,
};


class EditProfile extends React.Component {

    constructor(props) {
        super(props);

        if (this.props.userProfile !== undefined) {
            this.state = {
                firstName: props.userProfile.firstName,
                lastName: props.userProfile.lastName,
                email: props.userProfile.email,
                university: props.userProfile.university,
                price: props.userProfile.price,
                description: props.userProfile.description,
                courses: props.userProfile.courses,
                timeSlotIds: props.userProfile.timeSlotIds,
                avatar: props.userProfile.avatar,
            }
        } else {
            this.state = {
                firstName: '',
                lastName: '',
                email: '',
                university: '',
                price: '',
                description: '',
                timeSlotIds: [],
                courses: [],
                avatar: ''
            }
        }
    }

    handleChangeFirstName = (firstName) => {
        this.setState({
            firstName
        })
    };

    handleChangeLastName = (lastName) => {
        this.setState({
            lastName
        })
    };

    handleChangeEmail = (email) => {
        this.setState({
            email
        })
    };

    handleChangeUniversity = (university) => {
        this.setState({
            university
        })
    };

    handleChangePrice = (price) => {
        // if(/\d+.\d{2}/.test(price))
        this.setState({
            price
        })
    };

    handleChangeDescription = (description) => {
        this.setState({
            description
        })
    };

    handleComingTimeSlots = (arr) => {
        this.setState({ timeSlotIds: arr });
    };

    // resize uploaded avatar as base64 string
    fileChangedHandler(value) {
        if (value && value.name) {
            Resizer.imageFileResizer(
                value,
                200,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    this.setState({
                        avatar: uri,
                        fileName: value.name
                    });
                    console.log(uri);
                },
                'base64'
            );
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let userProfile = this.props.userProfile;
        // TODO: change to not user profile
        if (userProfile === undefined) {
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
            userProfile.avatar = this.state.avatar
        }

        // onsubmit defined by EditProfileView
        this.props.onSubmit(userProfile);
    };

    // onReset={() => this.props.history.goBack()}
    // onChange={this.handleChangeEmail}
    render() {
        if (this.props.userType === 'tutor') {
            return (
                <Card style={style} className="md-block-centered">
                    <form className="md-grid" onSubmit={this.handleSubmit} onReset={() => this.props.history.goBack()}>
                        <div className='md-grid md-cell md-cell--7' style={{ padding: '0px' }}>
                            <TextField
                                style={{ padding: 0, margin: 0 }}
                                className="md-cell md-cell--6"
                                leftIcon={<FontIcon>person</FontIcon>}
                                label="FirstName"
                                id="FirstNameField"
                                type="text"
                                value={this.state.firstName}
                                required={true}
                                onChange={this.handleChangeFirstName}
                                errorText="First name is required" />
                            <TextField
                                style={{ padding: 0, margin: 0 }}
                                className="md-cell md-cell--6"
                                leftIcon={<FontIcon>person</FontIcon>}
                                label="LastName"
                                id="LastNameField"
                                type="text"
                                required={true}
                                value={this.state.lastName}
                                onChange={this.handleChangeLastName}
                                errorText="Last name is required" />
                            <TextField
                                style={{ padding: 0, margin: 0 }}
                                className="md-cell md-cell--6"
                                leftIcon={<FontIcon>email</FontIcon>}
                                label="email"
                                id="emailField"
                                type="text"
                                value={this.state.email} />
                            <TextField
                                style={{ padding: 0, margin: 0 }}
                                className="md-cell md-cell--6"
                                label="price"
                                id="PriceField"
                                leftIcon={<FontIcon>euro_symbol</FontIcon>}
                                value={this.state.price}
                                type="number"
                                required={true}
                                onChange={value => this.handleChangePrice(value)}
                                errorText="Price is required" />
                            <TextField
                                label="University"
                                style={{ paddingLeft: '0px', width: '100%' }}
                                leftIcon={<FontIcon>school</FontIcon>}
                                id="UniversityField"
                                type="text"
                                className="md-row"
                                required={true}
                                value={this.state.university}
                                onChange={this.handleChangeUniversity}
                                errorText="University is required" />
                            {/* TODO: Add courses
                                <Grid style={{ padding: 0, margin: 0 }}>
                                    <Cell size={6}>
                                        <TextField
                                            id="TeachingCoursesField"
                                            leftIcon={<FontIcon>book</FontIcon>}
                                            value={'Teaching Courses: '}
                                            type="text" />
                                    </Cell>
                                    <Cell size={6} align='middle'>
                                        {this.renderCourses()}
                                    </Cell>
                                </Grid> */}
                            {/* TODO: show rating
                                <div style={{ marginBottom: '13.5px' }}>
                                    <FontIcon style={{ paddingLeft: '8px', marginRight: '16px', }}>thumbs_up_down</FontIcon>
                                    <span style={{ height: '100%', verticalAlign: 'middle' }}>Rating:</span>
                                    <div style={{ paddingLeft: '8px', display: 'inline', verticalAlign: 'middle' }}>
                                        <StarRatingComponent
                                            name="rate2"
                                            editing={false}
                                            starCount={5}
                                            value={+this.state.rating}
                                            starColor={`#ffb400`}
                                            emptyStarColor={`#333`} />
                                    </div>
                                </div> */}
                            <hr />
                            <TextField
                                label="description"
                                id="DescriptionLabel"
                                leftIcon={<FontIcon>description</FontIcon>}
                                type="text"
                                className="md-row"
                                required={true}
                                rows={1}
                                value={this.state.description}
                                onChange={value => this.handleChangeDescription(value)}
                                placeholder="Write some text to describe yourself"
                                errorText="Description is required" />
                        </div>
                        <Cell size={5} style={{ paddingTop: '16px' }}>
                            <div style={{ padding: '0 50px', }}>
                                <Media style={{ borderRadius: '15px', boxShadow: '4px 4px 10px gray' }} aspectRatio="1-1">
                                    <img src={this.state.avatar} alt="Tutor Avatar" />
                                </Media>
                            </div>
                            <FileInput className="md-block-centered" style={{ marginTop: '16px', width: '60%' }} type="file" id='photo' accept="image/*" onChange={values => this.fileChangedHandler(values)} primary />
                        </Cell>
                        <hr style={{ height: '1px', width: '100%' }} />
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
                            leftIcon={<FontIcon>person</FontIcon>}
                            id="FirstNameField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.firstName}
                            onChange={this.handleChangeFirstName}
                            errorText="First name is required" />
                        <TextField
                            label="LastName"
                            leftIcon={<FontIcon>person</FontIcon>}
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
                            leftIcon={<FontIcon>email</FontIcon>}
                            id="emailField"
                            type="text"
                            className="md-row"
                            value={this.state.email} />
                        <TextField
                            label="University"
                            leftIcon={<FontIcon>school</FontIcon>}
                            id="UniversityField"
                            type="text"
                            className="md-row"
                            required={true}
                            value={this.state.university}
                            onChange={this.handleChangeUniversity}
                            errorText="University is required" />
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