import React from 'react';
import { Avatar, Card, CardTitle } from 'react-md';
import StarRatingComponent from 'react-star-rating-component';
import { toast } from "react-toastify";
import FindMyTutor from '../../Images/Logo.png';
import EditProfileService from '../../Services/EditProfileService';

export default class ReviewCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            review: this.props.review,
            customerName: 'anonymous',
        };
    }

    componentWillMount() {
        EditProfileService.getCustomerByCustomerEmail(this.props.review.customerEmail)
            .then((customer) => {
                this.setState({
                    customerName: `${customer.firstName} ${customer.lastName}`
                })
            }).catch((e) => {
            console.error(e);
            toast.error('Error by getting tutor review');
        });
    }

    render() {
        return (
            <Card
                className="md-grid md-block-centered md-row md-full-width"
                style={{
                    background: 'transparent',
                    marginBottom: '8px'
                }} >
                <CardTitle
                    title={
                        <div>
                            <span style={{ height: '100%', verticalAlign: 'middle' }}>{this.state.customerName}</span>
                            <div style={{ paddingLeft: '32px', display: 'inline', verticalAlign: 'middle' }}>
                                <StarRatingComponent
                                    name="rate2"
                                    editing={false}
                                    starCount={5}
                                    value={this.state.review.overallRating}
                                    starColor={`#ffb400`}
                                    emptyStarColor={`#333`} />
                            </div>
                        </div>
                    }
                    subtitle={this.state.review.text}
                    avatar={<Avatar src={FindMyTutor} role="presentation" />}
                    style={{ padding: '8px' }}
                />
            </Card>
        )
    }
}