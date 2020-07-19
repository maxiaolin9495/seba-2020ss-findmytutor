import React from "react";
import Navigation from "../UIcomponents/PageDesign/Navigation";
import Background from '../Images/Homepage.jpg';
import UserService from '../Services/UserService';
import TutorialService from '../Services/TutorialService';
import ReviewService from "../Services/ReviewService";
import ReviewPage from "../UIcomponents/PageDesign/ReviewPage";
import { toast } from 'react-toastify';

export class ReviewTutorView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tutor: [],
            tutorial: [],
            review: {}
        };
    }

    componentDidMount() {
        let tutorialId = this.props.match.params.id;
        TutorialService.getTutorial(tutorialId).then((data) => {
            TutorialService.getTutorByTutorEmail(data.tutorEmail)
                .then((tutor) => {
                    this.setState({
                        tutor: tutor,
                        tutorial: data
                    });
                });
            if (data.reviewId)
                ReviewService.getReview(data.reviewId)
                    .then((review) => {
                        this.setState({
                            review
                        })
                    });
        }).catch((e) => {
            console.error(e);
        });
        let user = UserService.getCurrentUser();
        if (Object.keys(user).length === 0 && user.constructor === Object) {
            // user not define
            this.setState({
                userType: undefined,
                loading: false,
                error: "No login information"
            })
        } else {
            this.setState({
                userType: user.userType
            });
            // get tutor profile
            if (user.userType === 'tutor') {
                this.setState({
                    userType: tutor,
                    loading: false,
                    error: "Tutor can't review tutor"
                });
            }
        }
    }

    handleReview = (review) => {
        (this.state.tutorial.reviewId) ?
            ReviewService.updateReview(this.state.tutorial.reviewId, review)
                .then(() => {
                    toast.success('Successfully updated');
                    this.props.history.goBack();
                }).catch((e) => {
                    console.error(e);
                    this.setState(Object.assign({}, this.state, { error: 'Error while creating review' }));
                }) :
            ReviewService.createReview({
                ...review,
                tutorialId: this.state.tutorial._id
            }).then(() => {
                toast.success('Successfully submitted');
                this.props.history.goBack();
            }).catch((e) => {
                console.error(e);
                this.setState(Object.assign({}, this.state, { error: 'Error while creating review' }));
            });
    };

    render() {
        return (
            <div className="ReviewPage">
                {console.log("here")}
                <Navigation />
                {<ReviewPage
                    onSubmit={this.handleReview}
                    tutor={this.state.tutor}
                    tutorial={this.state.tutorial}
                    review={this.state.review} />}

                <div className="img-container">
                    <img src={Background} className="bg" alt={"Background"} />
                </div>
            </div>
        )
    }
}