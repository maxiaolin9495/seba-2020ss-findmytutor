import React from 'react';
import BookingCard from '../UIcomponents/BookingList/BookingCard';
import Background from '../Images/Homepage.jpg';
import TutorialService from "../Services/TutorialService.js"
import UserService from "../Services/UserService";
import { toast } from 'react-toastify';
import Navigation from "../UIcomponents/pageDesign/Navigation";

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

    cancelTutorial = (tutorialInfo) => {
        TutorialService.cancelTutorial(tutorialInfo).then((data) => {
            toast.success('Successfully cancel tutorial')
            this.setState({
                tutorials: this.state.tutorials.map(t => (
                    t._id === tutorialInfo._id ?
                        Object.assign({}, t, { tutorialStatus: 'cancelled' }) :
                        t))
            })
        }).catch(() => {
            toast.error('Failed to cancel tutorial');
        });
    }

    confirmTutorial = (tutorialInfo) => {
        TutorialService.confirmTutorial(tutorialInfo).then((data) => {
            toast.success('Successfully confirm tutorial')
            this.setState({
                tutorials: this.state.tutorials.map(t => (
                    t._id === tutorialInfo._id ?
                        Object.assign({}, t, { tutorialStatus: 'confirmed' }) :
                        t))
            })
        }).catch(() => {
            toast.error('Failed to confirm tutorial');
        });
    }

    render() {
        if (this.state.loading) {
            return <h2>Loading</h2>
        }

        // TODO: sort tutorials
        return (
            <div>
                <Navigation />

                <section>

                    {this.state.tutorials.map((t) => {
                        return (
                            this.state.userType === 'customer' ?
                                <BookingCard
                                    key={t._id}
                                    tutorial={t}
                                    userType={this.state.userType}
                                    handleReview={this.handleReview}
                                    cancelTutorial={this.cancelTutorial} /> :
                                <BookingCard
                                    key={t._id}
                                    tutorial={t}
                                    userType={this.state.userType}
                                    handleReview={this.handleReview}
                                    cancelTutorial={this.cancelTutorial}
                                    confirmTutorial={this.confirmTutorial} />
                        )
                    })}
                    <img src={Background} alt={"A Background Picture"} className="bg" />


                </section>
            </div>
        );
    }
}
