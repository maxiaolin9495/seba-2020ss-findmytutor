import React from 'react';
import { withRouter } from "react-router-dom";
import BookingCard from "./BookingCard";
import TutorialService from "../../Services/TutorialService";
import EditProfileService from "../../Services/EditProfileService";

class BookingList extends React.Component {
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
            }
        }
    }
    componentWillMount() {
        this.props.userType === 'customer' ?
            TutorialService.getTutorByTutorEmail(this.props.tutorial.tutorEmail).then((tutor) => {
                this.setState({
                    tutor
                })
            }) :
            EditProfileService.getCustomerByCustomerEmail(this.props.tutorial.customerEmail).then((customer) => {
                this.setState({
                    customer
                })
            });
    }

    render() {
        return (<div>
            {this.props.userType === 'customer' ?
                <BookingCard
                    tutor={this.state.tutor}
                    tutorial={this.props.tutorial}
                    userType={this.props.userType}
                    handleReview={this.props.handleReview} /> :
                <BookingCard
                    customer={this.state.customer}
                    tutorial={this.props.tutorial}
                    userType={this.props.userType}
                    handleReview={this.props.handleReview} />}
        </div>);
    }
}

export default withRouter(BookingList);