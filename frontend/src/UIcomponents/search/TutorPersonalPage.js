"use strict";

import React from 'react';
import { Avatar, Card, CardTitle, TextField, Media, Grid, Cell, Button, FontIcon } from 'react-md';
import { withRouter } from 'react-router-dom'
import StarRatingComponent from 'react-star-rating-component';
import FindMyTutor from '../../Images/logo.png';
import BookingCalendar from "../Calendar/BookingCalendar";


class TutorPersonalPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCourse: this.props.selectedCourse
        };
    }

    // TODO: create booking

    // TODO: get available time slots

    // add reviews
    addReview = () => {
        let reviews = [{
            user: 'Linda',
            rating: 5,
            comment: 'Best teacher and advisor!!!I have had 30 lessons with her, and I am 100% satisfied.',
            avatar: FindMyTutor
        }, {
            user: 'Lukas',
            rating: 4,
            comment: 'Jerry is a professional and understanding tutor, she always wait for her lessons with interest and invariably makes progress',
            avatar: FindMyTutor
        }];

        return reviews.map(r => {
            return (
                <Card
                    className="md-grid md-block-centered md-row md-full-width"
                    style={{
                        background: 'transparent',
                        marginBottom: '8px'
                    }}
                    key={r.user}>
                    <CardTitle
                        title={
                            <div>
                                <span style={{ height: '100%', verticalAlign: 'middle' }}>{r.user}</span>
                                <div style={{ paddingLeft: '32px', display: 'inline', verticalAlign: 'middle' }}>
                                    <StarRatingComponent
                                        name="rate2"
                                        editing={false}
                                        starCount={5}
                                        value={r.rating}
                                        starColor={`#ffb400`}
                                        emptyStarColor={`#333`} />
                                </div>
                            </div>
                        }
                        subtitle={r.comment}
                        avatar={<Avatar src={r.avatar} role="presentation" />}
                        style={{ padding: '8px' }}
                    />
                </Card>
            )
        })
    };

    renderCourses = () => {
        // TODO: remove manual added courses
        let courses = (this.props.tutor.courses && this.props.tutor.courses.length) ? this.props.tutor.courses : ['SEBA', 'Database'];
        // TODO: use (key, val)
        return courses.map(c => {
            let style = {
                marginRight: '8px'
            };
            if (c === this.state.selectedCourse) {
                style = {
                    ...style,
                    backgroundColor: '#f44336',
                    color: '#ffffff'
                }
            }
            return (
                <Button
                    key={c}
                    style={style}
                    secondary={c !== this.state.selectedCourse}
                    onClick={() => this.changeSelectedCourse(c)}
                    raised>
                    {c}
                </Button>)
        })
    };

    changeSelectedCourse = (selectedCourse) => {
        this.setState({
            selectedCourse
        })
    };


    render() {
        return (
            <Card
                className="md-grid md-block-centered"
                id="tutorPersonalPageBox"
                label="TutorPersonalPage"
                style={{
                    maxWidth: '75%',
                    marginTop: '1%',
                    background: 'rgb(255,255,255,0.8)'
                }} >
                <CardTitle
                    style={{ paddingBottom: 0 }}
                    title={this.props.tutor.firstName + ' ' + this.props.tutor.lastName} />
                <hr style={{ height: 1, width: '60%', marginLeft: '16px' }} />
                <Grid>
                    <Cell size={7}>
                        <Grid style={{ padding: 0, margin: 0 }}>
                            <Cell size={6}>
                                <TextField
                                    leftIcon={<FontIcon>person</FontIcon>}
                                    id="FirstNameField"
                                    type="text"
                                    value={'First Name: ' + this.props.tutor.firstName} />
                            </Cell>
                            <Cell size={6}>
                                <TextField
                                    leftIcon={<FontIcon>person</FontIcon>}
                                    id="LastNameField"
                                    type="text"
                                    value={'Last Name: ' + this.props.tutor.lastName} />
                            </Cell>
                        </Grid>
                        <TextField
                            leftIcon={<FontIcon>school</FontIcon>}
                            style={{ paddingLeft: '8px' }}
                            id="UniversityField"
                            type="text"
                            className="md-row"
                            value={'University: ' + this.props.tutor.university} />
                        <div className="md-grid" style={{ padding: '0px' }}>
                            <TextField
                                id="PriceField"
                                className="md-cell md-cell--6"
                                leftIcon={<FontIcon>euro_symbol</FontIcon>}
                                value={'Price: ' + this.props.tutor.price}
                                type="text" />
                            <div className="md-cell md-cell--6 md-cell--center">
                                {/* <div style={{ marginBottom: '13.5px' }}> */}
                                <FontIcon style={{ paddingLeft: '8px', paddingTop: '4px', marginRight: '16px', }}>thumbs_up_down</FontIcon>
                                <span style={{ height: '100%', verticalAlign: 'middle' }}>Rating:</span>
                                <div style={{ paddingLeft: '8px', display: 'inline', verticalAlign: 'middle' }}>
                                    <StarRatingComponent
                                        name="rate2"
                                        editing={false}
                                        starCount={5}
                                        value={+this.props.tutor.rating}
                                        starColor={`#ffb400`}
                                        emptyStarColor={`#333`} />
                                </div>
                            </div>
                        </div>
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
                        </Grid>
                        <div className='md-grid'>
                            <h3 className='md-row md-full-width'>About me</h3>
                            <div className='md-row'>{this.props.tutor.description}</div>
                        </div>
                    </Cell>
                    <Cell size={5}>
                        <div style={{ padding: '0 50px', }}>
                            <div style={{}}>
                                <Media aspectRatio="1-1" style={{ borderRadius: '15px', boxShadow: '4px 4px 10px gray', maxHeight: '40px' }} >
                                    <img src={this.props.tutor.avatar} alt="Tutor Avatar" />
                                </Media>
                            </div>
                        </div>
                        <Button
                            className="md-block-centered"
                            style={{
                                marginTop: '16px',
                                borderRadius: '30px',
                                border: '2px solid #00b0ff',
                                color: '#00b0ff'
                            }} flat >CONTACT</Button>
                    </Cell>


                </Grid>
                <hr style={{ height: 1 }} />
                <div className="md-grid">
                    <h1 className='md-row md-full-width'>Calender</h1>
                    {/** Calender should be placed here */}
                    <BookingCalendar/>
                </div>

                <hr style={{ height: 1 }} />
                <div className="md-grid">
                    <h1 className='md-row md-full-width'>Comments</h1>
                    {this.addReview()}
                </div>

            </Card >
        );
    }
}

export default withRouter(TutorPersonalPage);
