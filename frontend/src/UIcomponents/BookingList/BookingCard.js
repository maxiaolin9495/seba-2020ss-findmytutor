import React from 'react';
import { Button, FontIcon } from 'react-md';
import Dialog from "../PageDesign/Dialog"
import TutorialService from "../../Services/TutorialService";
import EditProfileService from "../../Services/EditProfileService";
import UserService from "../../Services/UserService";

const buttonStyle = {
    background: '#64A338',
    color: 'white',
    fontSize: '14px',
    marginTop: '6px',
    paddingBottom: '5px',
    fontFamily: 'San Francisco',
    textAlign: 'center'
};

const StatusButton = (attr, iconName, background, name) => {
    return (
        <Button
            className={attr}
            raised
            disabled
            iconBefore={false}
            iconEl={<FontIcon>{iconName}</FontIcon>}
            style={{
                ...buttonStyle,
                background,
            }} >
            {name}
        </Button>
    )
}

export default class BookingCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tutor: {
                firstName: "TutorFirstName",
                lastName: "TutorLastName"
            },
            customer: {
                firstName: "CustomerFirstName",
                lastName: "CustomerLastName"
            },
            cancelDialogVisible: false,
            confirmDialogVisible: false
        }
    }

    componentWillMount() {
        // this.props.userType === 'customer' ?
        TutorialService.getTutorByTutorEmail(this.props.tutorial.tutorEmail)
            .then((tutor) => {
                this.setState({
                    tutor
                })
            }); // :
        EditProfileService.getCustomerByCustomerEmail(this.props.tutorial.customerEmail)
            .then((customer) => {
                this.setState({
                    customer
                })
            });
    }

    convertTimeToStr = (timeStr) => {
        let dateObj = new Date(parseInt(timeStr));
        let mm = dateObj.getMonth() + 1;
        let dd = dateObj.getDate();

        return [
            dateObj.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('-');
    };

    showDuration = (startTime, endTime) => {
        let startTimeObj = new Date(parseInt(startTime));
        let endTimeObj = new Date(parseInt(endTime));
        return `${String(startTimeObj.getHours()).padStart(2, '0')}:${String(startTimeObj.getMinutes()).padStart(2, '0')} - ${String(endTimeObj.getHours()).padStart(2, '0')}:${String(endTimeObj.getMinutes()).padStart(2, '0')}`
    };

    cancelTutorial = () => {
        let tutorialInfo = {
            _id: this.props.tutorial._id,
            status: 'cancelled',
            tutorFirstName: this.state.tutor.firstName,
            tutorEmail: this.props.tutorial.tutorEmail,
            customerEmail: this.props.tutorial.customerEmail,
            customerFirstName: this.state.customer.firstName
        };
        this.props.cancelTutorial(tutorialInfo);
    };

    confirmTutorial = () => {
        let tutorialInfo = {
            _id: this.props.tutorial._id,
            status: 'confirmed',
            customerEmail: this.props.tutorial.customerEmail,
            customerFirstName: this.state.customer.firstName
        };
        this.props.confirmTutorial(tutorialInfo);
    };

    showLastButton = () => {
        switch (this.props.tutorial.tutorialStatus) {
            case 'finished':
            case 'reviewed':
                if (this.props.userType === 'customer') {
                    return (
                        <Button
                            raised
                            className="md-cell md-cell--2"
                            primary
                            style={{
                                // background: '#555',
                                borderRadius: '10px',
                                marginTop: '32px',
                                color: 'white',
                                fontSize: '18px',
                                fontFamily: 'San Francisco',
                            }}
                            onClick={() => this.props.handleReview(`/review/${this.props.tutorial._id}`)}>
                            REVIEW
                        </Button>);
                }
                else {
                    return '';
                }
            case 'notConfirmed':
            case 'confirmed':
                return (
                    <div className="md-cell md-cell--2"
                        style={{
                            marginTop: 0,
                            marginBottom: '20px'
                        }}>
                        <Dialog actionName='cancel' onClick={() => this.cancelTutorial()} />
                        {this.ifShouldRemind() && !this.ifPastVideo() ?
                            <Button
                                raised
                                className="md-full-width"
                                style={{
                                    background: '#696969',
                                    marginTop: '10px',
                                    color: 'white',
                                    borderRadius: '10px',
                                    fontSize: '18px',
                                    paddingBottom: '5px',
                                    fontFamily: 'cursive',
                                }}
                                onClick={() => this.goToVideoPage()}
                            >
                                Video Call
                            </Button> :
                            <div />
                        }
                    </div>

                );
            default:
                return '';
        }
    };

    showStatusButton = () => {
        switch (this.props.tutorial.tutorialStatus) {
            case 'reviewed':
                if (this.props.userType === 'customer')
                    return StatusButton('md-full-width', 'mark_chat_read', '#64A338', 'reviewed');
            case 'finished':
                return StatusButton('md-full-width', 'done', '#64A338', 'finished');
            case 'notConfirmed':
                if (this.props.userType === 'customer') {
                    return StatusButton('md-full-width', 'more_horiz', '#FBBC05', 'need confirm');
                } else {
                    return <Dialog actionName='confirm' onClick={() => this.confirmTutorial()}/>;
                }
            case 'confirmed':
                return StatusButton('md-full-width', 'check_circle', '#4285F4', 'confirmed');
            case 'cancelled':
                return StatusButton('md-full-width', 'clear', '#87A2C7', 'cancelled');
            default:
                return '';
        }
    };

    ifShouldRemind = () => {
        let now = new Date().getTime();
        return !this.props.tutorial.ifHadVideo &&
            this.props.tutorial.startTime - now < 180000000;
    };

    ifPastVideo = () => {
        let now = new Date().getTime();
        return now - this.props.tutorial.endTime > 0;
    };

    goToVideoPage = () => {
        let userType = UserService.getCurrentUser().userType;
        if (userType === `customer`) {
            this.props.handleChatRoom(`/video/${this.props.tutorial._id}`);
        } else {
            this.props.handleChatRoom(`/video/${this.props.tutorial._id}`);
        }
    }

    render() {
        return (
            <div className="md-block-centered" style={{
                marginTop: '20px',
                boxShadow: '10px 10px 20px gray',
                width: '70%',
                display: 'flex',
                background: 'white',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <div className="md-grid md-full-width">
                    <div className="md-cell md-cell--3">
                        <label
                            className="md-text--secondary"
                        >
                            {this.props.userType === 'customer' ?
                                'Tutor name:' :
                                'Customer name:'}
                        </label>
                        <h1 style={{
                            color: 'black',
                            fontWeight: 'bolder',
                            fontFamily: 'Lucida Bright'
                        }}>
                            {this.props.userType === 'customer' ?
                                `${this.state.tutor.firstName} ${this.state.tutor.lastName}` :
                                `${this.state.customer.firstName} ${this.state.customer.lastName}`}
                        </h1>
                        <div style={{ margin: 0, padding: 0 }}>
                            <label className="md-text--secondary" >
                                Book date:
                            </label>
                            <h2 style={{
                                marginTop: '0px',
                                marginBottom: '0px',
                                color: 'black',
                            }}>
                                {this.convertTimeToStr(this.props.tutorial.bookedTime)}
                            </h2>
                        </div>
                    </div>
                    {/* {this.props.userType === 'customer' && */}
                    <div className="md-cell md-cell--2" id="price-tag">
                        <label className="md-text--secondary" >
                            Price:
                            </label>
                        <h2 style={{
                            color: 'black',
                            textAlign: 'left'
                        }}>
                            EUR {this.props.tutorial.price}
                        </h2>
                    </div>

                    <div className="md-cell md-cell--2" id="tutorial-time">
                        <label className="md-text--secondary" >
                            Tutorial date:
                        </label>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{
                                fontWeight: 'bolder',
                                fontFamily: 'cursive'
                            }}>{this.convertTimeToStr(this.props.tutorial.startTime)}</h3>
                            <h3 style={{
                                fontWeight: 'bolder',
                                fontFamily: 'cursive'
                            }}>{this.showDuration(this.props.tutorial.startTime, this.props.tutorial.endTime)}</h3>
                        </div>
                    </div>
                    <div className="md-cell md-cell--2 md-cell--0-phone-offset md-cell--0-tablet-offset md-cell--1-desktop-offset">
                        <label className="md-text--secondary" >
                            Status:
                        </label>
                        {this.showStatusButton()}
                    </div>

                    {this.showLastButton()}
                </div>
                <hr style={{ marginLeft: 0, marginRight: 0 }} />
                        <h4 style={{ marginLeft: '8px', marginBottom: 0 }}>Course: {this.props.tutorial.selectedCourse || ''} / Topic: {this.props.tutorial.sessionTopic}</h4>
            </div>
        );
    }
}
