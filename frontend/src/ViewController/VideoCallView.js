import React from 'react';
import Navigation from "../UIcomponents/PageDesign/Navigation";
import VideoCall from "../UIcomponents/VideoCall/VideoCall";
import UserService from "../Services/UserService";
import {toast} from "react-toastify";


export class VideoCallView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: []
        };
    }

    componentWillMount() {
        let userType = UserService.getCurrentUser().userType;
        if (!userType) {
            // TODO: Need Test
            toast.error("Need login information!");
            this.props.history.push('/login');
        }
    }

    render() {
        setTimeout(() => window.scrollTo(0, 0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                    <VideoCall caller={this.props.match.params.email} ready={this.props.match.params.email !== null}/>
                </section>
            </div>
        );
    }
}