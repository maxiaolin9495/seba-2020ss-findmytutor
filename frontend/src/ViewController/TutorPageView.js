import React from 'react';
import TutorPageService from "../Services/TutorPageService";
import UserService from "../Services/UserService.js";
import TutorPersonalPage from '../UIcomponents/Search/TutorPersonalPage';
import { toast } from "react-toastify";
import Background from '../Images/Homepage.jpg';
import Navigation from "../UIcomponents/PageDesign/Navigation";

export class TutorPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tutor: {},
            reviews: [],
            selectedCourse: props.location.search.split('=')[1] || ''
        };
    }

    componentWillMount() {
        UserService.getCurrentUser().userType === 'tutor' && this.props.history.push("/booking");
        
        this.setState({
            loading: true
        });
        let tutorId = this.props.match.params.id;

        TutorPageService.getTutorProfileById(tutorId)
            .then((data) => {
                this.setState({
                    tutor: data,
                    loading: false
                });
                console.log(data);
            }).catch((e) => {
                console.error(e);
                toast.error('Error by getting tutor profile');
                this.setState({
                    loading: false
                });
                this.props.history.goBack();
            });

        TutorPageService.getTutorReviews(tutorId)
            .then((reviews) => {
                this.setState({
                    reviews
                });
            }).catch((e) => {
                console.error(e);
                toast.error('Error by getting tutor reviews');
            })
    }

    render() {
        if (this.state.loading) {
            return <h2>Loading</h2>
        }
        return (
            <div>
                <Navigation />
                <section>
                    <img src={Background} alt={"A Background Picture"} className="bg" />
                    <TutorPersonalPage
                        loading={this.state.loading}
                        tutor={this.state.tutor}
                        reviews={this.state.reviews}
                        selectedCourse={this.state.selectedCourse} />
                </section>
            </div>
        );
    }
}
