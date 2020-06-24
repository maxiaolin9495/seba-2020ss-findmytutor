import React from 'react';
import BookingList from '../UIcomponents/BookingList/BookingList';
import Background from '../Images/Homepage.jpg';
import TutorialService from "../Services/TutorialService.js"
import UserService from "../Services/UserService";
import { toast } from 'react-toastify';

export class BookingListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tutorials: [],
            filteredData: [],
            error: undefined
        };
    }

    componentWillMount() {
        this.setState({
            loading: true
        });
        let userType = UserService.getCurrentUser().userType;
        if (!userType) {
            // TODO: Need Test
            toast.error("Need login information!");
            this.props.history.goBack();
        }
        userType === `customer` ?
            TutorialService.getAllTutorialsForCustomer().then((tutorials) => {
                console.log(tutorials);
                this.setState({
                    tutorials,
                    loading: false,
                    userType
                });
            }).catch((e) => {
                console.error(e);
            }) :
            TutorialService.getAllTutorialsForTutor().then((tutorials) => {
                console.log(tutorials);
                this.setState({
                    tutorials,
                    loading: false,
                    userType
                });
            }).catch((e) => {
                console.error(e);
            });
    }

    handleReview = (url) => {
        this.props.history.push(url);
    }

    render() {
        if (this.state.loading) {
            return <h2>Loading</h2>
        }
        let tutorial = {
            tutorEmail: "1.2@3.cc",
            customerEmail: "ga26piq@mytum.de",
            sessionTopic: "Regression analysis",
            bookedTime: "Tue Jun 23 2020 21:14:43 GMT+0200 (Central European Summer Time)",
            price: "16",
            tutorialStatus: 'confirmed',
            transactionStatus: 'transferred',
            startTime: "Tue Jun 23 2020 22:00:00 GMT+0200 (Central European Summer Time)",
            endTime: "Tue Jun 23 2020 23:00:00 GMT+0200 (Central European Summer Time)"
        }

        // TODO: sort tutorials
        return (
            <div>
                <img src={Background} className="bg" />
                <section>
                    {this.state.tutorials.map((t) => {
                        return (
                            <BookingList
                                key={t._id}
                                tutorial={t} 
                                userType={this.state.userType}
                                handleReview={this.handleReview} />
                        )
                    })}
                    <BookingList
                        tutorial={tutorial}
                        userType={this.state.userType} 
                        handleReview={this.handleReview} />
                </section>
            </div>
        );
    }
}
