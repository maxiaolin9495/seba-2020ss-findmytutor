import React from 'react';
import Navigation from "../UIcomponents/PageDesign/Navigation";
import VideoCall from "../UIcomponents/VideoCall/VideoCall";
import UserService from "../Services/UserService";
import {toast} from "react-toastify";
import io from "socket.io-client";
import {backendUri} from "../config";
import {ChatBar} from "../UIcomponents/ChatBar/ChatBar";
import TutorialService from "../Services/TutorialService";


export class VideoCallView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            socket :io( `${backendUri}/chat` ),
        };

    }

    componentWillMount() {
        let userType = UserService.getCurrentUser().userType;
        if (!userType) {
            toast.error("Need login information!");
            this.props.history.push('/login');
        }

        TutorialService.getTutorial(this.props.match.params.id).then((data) => {
            if(UserService.getCurrentUser().userType===`customer`){
                this.setState({caller: data.tutorEmail, clientId:data.customerEmail});
            }else{
                this.setState({caller: data.customerEmail, clientId:data.tutorEmail});
            }
        })

    }

    render() {
        setTimeout(() => window.scrollTo(0, 0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                    <div style={{display: "flex"}}>
                    <ChatBar socket ={this.state.socket} id={this.props.match.params.id} ready={this.props.match.params.id !== null}/>
                    <VideoCall caller={this.state.caller} clientId={this.state.clientId} ready={this.props.match.params.id !== null}
                   socket={this.state.socket} />
                    </div>
                </section>
            </div>
        );
    }
}