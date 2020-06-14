import React from 'react';
import TutorPageService from "../Services/TutorPageService";
import TutorPersonalPage from '../UIcomponents/search/TutorPersonalPage';
import Navigation from '../UIcomponents/pageDesign/Navigation';
import { toast } from "react-toastify";
import Background from '../Images/Homepage.jpg';

export class TutorPageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tutor: {},
            reviews: []
        };
    }

    componentDidMount() {
        this.setState({
            loading: true
        });
        let tutorId = this.props.match.params.id;

        TutorPageService.getTutorProfileById(tutorId).then((data) => {
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
                        reviews={this.state.reviews} />
                </section>
            </div>
        );
    }
}
