"use strict";

import React from 'react';
import { Card, CardTitle, TextField, Media, Grid, Cell, Button, FontIcon } from 'react-md';
import { withRouter } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import BookingCalendar from "../Calendar/BookingCalendar";
import ReviewCard from "./ReviewCard";
import ContactDialog from "./ContactDialog";


class TutorPersonalPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCourse: this.props.selectedCourse,
            reviews: this.props.reviews,
            topic: ''
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.reviews !== prevState.reviews) {
            return ({
                reviews: nextProps.reviews,
            })
        }
        return null
    }


    renderCourses = () => {
        // TODO: remove manual added courses
        let courses = (this.props.tutor.courses && this.props.tutor.courses.length) ?
            this.props.tutor.courses :
            ['SEBA', 'Database'];
        // TODO: use (key, val)
        return courses.map(c => {
            let style = {
                marginRight: '8px',
                marginBottom: '8px'
            };
            if (c !== this.state.selectedCourse) {
                style = {
                    ...style,
                    backgroundColor: '#EEEEEE',
                    color: '#333'
                }
            }
            return (
                <Button
                    key={c}
                    style={style}
                    primary={c === this.state.selectedCourse}
                    //secondary={c !== this.state.selectedCourse}
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
                        <ContactDialog
                            tutorFistName={this.props.tutor.firstName}
                            tutorEmail={this.props.tutor.email} />
                    </Cell>


                </Grid>
                <hr style={{ height: 1 }} />
                <div>
                    <div className="md-grid">
                        <h1 className='md-row md-full-width'>Topics</h1>
                        <TextField className="md-cell md-cell--4"
                            id="TeachingCoursesTopics"
                            leftIcon={<FontIcon>book</FontIcon>}
                            label="Topics you want to learn in this tutorial:"
                            value={this.state.topic}
                            onChange={(value) => this.setState({ topic: value })}
                            type="text"
                            required={true}
                        />
                    </div>
                </div>

                <div>
                    <div className="md-grid">
                        <h1 className='md-row md-full-width'>Calender</h1>
                        {/** Calender should be placed here */}
                        <BookingCalendar topic={this.state.topic} selectedCourse={this.state.selectedCourse} />
                    </div>
                </div>
                <hr style={{ height: 1 }} />
                <div style={{ marginLeft: '0px' }}>
                    <div className="md-grid">
                        <h1 className='md-row md-full-width'>Comments</h1>
                        {this.state.reviews.map(r => {
                            return <ReviewCard review={r} key={r._id} />
                        })}
                    </div>
                </div>


            </Card >
        );
    }
}

export default withRouter(TutorPersonalPage);
