import React from 'react';
import { Button } from 'react-md';

export default class BookingCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
    }

    showDuration = (startTime, endTime) => {
        let startTimeObj = new Date(parseInt(startTime));
        let endTimeObj = new Date(parseInt(endTime));
        return `${String(startTimeObj.getHours()).padStart(2, '0')}:${String(startTimeObj.getMinutes()).padStart(2, '0')} - ${String(endTimeObj.getHours()).padStart(2, '0')}:${String(endTimeObj.getMinutes()).padStart(2, '0')}`
    }

    cancelTutorial = () => {
        console.log("Cancel tutorial");
        // TODO: push dialog
    }

    confirmTutorial = () => {
        console.log("Confirm tutorial");
        // TODO: push dialog
    }

    showLastButton = () => {
        switch (this.props.tutorial.tutorialStatus) {
            case 'finished':
            case 'reviewed':
                if(this.props.userType === 'customer')
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
                        onClick={() => this.props.handleReview(`/review/${this.props.tutorial._id}`)} >
                        REVIEW
                    </Button>)
                else
                    return '';
            case 'notConfirmed':
            case 'confirmed':
                return (
                    <Button
                        raised
                        className="md-cell md-cell--2"
                        style={{
                            background: '#555',
                            borderRadius: '10px',
                            marginTop: '32px',
                            color: 'white',
                            fontSize: '18px',
                            fontFamily: 'San Francisco',
                        }}
                        onClick={this.cancelTutorial} >
                        CANCEL
                    </Button>)
            default:
                return '';
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
                        <h1 style={{
                            color: 'black',
                            fontWeight: 'bolder',
                            fontFamily: 'Lucida Bright'
                        }}>
                            {this.props.userType === 'customer' ? 
                            `${this.props.tutor.firstName} ${this.props.tutor.lastName}` :
                            `${this.props.customer.firstName} ${this.props.customer.lastName}`}
                        </h1>
                        <div style={{ margin: 0, padding: 0 }}>
                            <h3 style={{
                                color: 'gray',
                                marginBottom: '0px',
                                fontWeight: 'bolder',
                                fontFamily: 'cursive',
                                float: 'left'
                            }}>Book date: </h3>
                            <h2 style={{
                                marginTop: '0px',
                                marginBottom: '0px',
                                color: 'black',
                                float: 'right'
                            }}>
                                {this.convertTimeToStr(this.props.tutorial.bookedTime)}
                            </h2>
                        </div>
                    </div>
                    {this.props.userType === 'customer' &&
                        <div className="md-cell md-cell--2" id="price-tag">
                            <h2 style={{
                                color: 'black',
                                textAlign: 'center'
                            }}>
                                EUR {this.props.tutorial.price}
                            </h2>
                        </div>}

                    <div className="md-cell md-cell--2" id="tutorial-time"
                        style={{ textAlign: 'center' }}>
                        <h3 style={{
                            fontWeight: 'bolder',
                            fontFamily: 'cursive'
                        }}>{this.convertTimeToStr(this.props.tutorial.startTime)}</h3>
                        <h3 style={{
                            fontWeight: 'bolder',
                            fontFamily: 'cursive'
                        }}>{this.showDuration(this.props.tutorial.startTime, this.props.tutorial.endTime)}</h3>
                    </div>
                    {this.props.userType === 'customer' ?
                        <Button
                            raised
                            className="md-cell md-cell--3"
                            disabled
                            style={{
                                background: '#333',
                                color: 'white',
                                fontSize: '18px',
                                marginTop: '32px',
                                paddingBottom: '5px',
                                fontFamily: 'San Francisco',
                            }} >
                            {this.props.tutorial.tutorialStatus === 'notConfirmed' ? 'NEED CONFIRMATION' : this.props.tutorial.tutorialStatus}
                        </Button> :
                        (
                            this.props.tutorial.tutorialStatus === 'notConfirmed' ?
                                <Button
                                    raised
                                    primary
                                    className="md-cell md-cell--2"
                                    style={{
                                        // background: '#333',
                                        // color: 'white',
                                        fontSize: '18px',
                                        marginTop: '32px',
                                        paddingBottom: '5px',
                                        fontFamily: 'San Francisco',
                                    }} 
                                    onClick={this.confirmTutorial} >
                                    CONFIRM
                            </Button> :
                                <Button
                                    raised
                                    className="md-cell md-cell--3"
                                    disabled
                                    style={{
                                        background: '#333',
                                        color: 'white',
                                        fontSize: '18px',
                                        marginTop: '32px',
                                        paddingBottom: '5px',
                                        fontFamily: 'San Francisco',
                                    }} >
                                    {this.props.tutorial.tutorialStatus === 'reviewed'? 'finished' : this.props.tutorial.tutorialStatus}
                                </Button>
                        )}
                    {this.showLastButton()}
                </div>
                <hr style={{ marginLeft: 0, marginRight: 0 }} />
                <h4 style={{ marginLeft: '8px' }}>Topics: {this.props.tutorial.sessionTopic}</h4>
            </div>
        );
    }
}
