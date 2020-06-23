import React from "react";
import Navigation from "../UIcomponents/pageDesign/Navigation";
import Background from '../Images/Homepage.jpg';
import UserService from '../Services/UserService';
import TutorialService from '../Services/TutorialService';
import TutorPageService  from "../Services/TutorPageService";
import ReviewService from "../Services/ReviewService";
import ReviewPage from "../UIcomponents/pageDesign/ReviewPage";
import { toast } from 'react-toastify';

export class ReviewTutorView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tutor:[],
            tutorial:[],
        };
    }

    componentDidMount() {
        let tutorialId = this.props.match.params.id;
        TutorPageService.getTutorProfileById(tutorialId).then((data) => {
            this.setState({tutorial: data});
        }).catch((e) => {
            console.error(e);
        });
        TutorialService.getTutorByTutorEmail(this.state.tutorial.tutorEmail).then((data) => {
            this.setState({
                tutor: data,
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
        }
        else {
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
            } else {
               if (this.state.tutorial.reviewId !== ""){

               }
            }
        }
    }

    createReview(review) {
        ReviewService.createReview(review).then((data) => {
            toast.message('Successfully submited');
            this.props.history.goBack();
        }).catch((e) => {
            console.error(e);
            this.setState(Object.assign({}, this.state, {error: 'Error while creating review'}));
        });  
    }

    render(){
        return (
          <div className = "ReviewPage">
              <Navigation/>
              <ReviewPage onSubmit={(review) => this.createReview(review)} tutor={this.state.tutor}/>
  
              <div className = "img-container">
                  <img src={Background} className="bg"/>    
              </div>
          </div>
        )
      }
}