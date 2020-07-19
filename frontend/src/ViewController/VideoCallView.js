import React from "react";
import Navigation from "../UIcomponents/PageDesign/Navigation";
import VideoCall from "../UIcomponents/VideoCall/VideoCall";
import UserService from "../Services/UserService";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { backendUri } from "../config";
import { ChatBar } from "../UIcomponents/ChatBar/ChatBar";
import TutorialService from "../Services/TutorialService";


export class VideoCallView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            socket: io(`${backendUri}/chat`),
        };

    }

    componentWillMount() {
        let userType = UserService.getCurrentUser().userType;
        if (!userType) {
            toast.error("Need login information!");
            this.props.history.push('/login');
            return;
        }

        TutorialService.getTutorial(this.props.match.params.id)
            .then((data) => {
                if (userType === 'customer') {
                    this.setState({caller: data.tutorEmail, clientId: data.customerEmail});
                } else {
                    this.setState({caller: data.customerEmail, clientId: data.tutorEmail});
                }
            })
        window.addEventListener("beforeunload", this.handleWindowBeforeUnload);
    }

    handleWindowBeforeUnload = () => {
        console.log('Refreshing window');
        this.state.socket.emit('disconnect');
        this.state.socket.close();
    }
    
    componentWillUnmount(){
        console.log(`Leaving page`);
        this.state.socket.emit('disconnect');
        this.state.socket.close();
    }

    render() {
        setTimeout(() => window.scrollTo(0, 0), 150);
        return (
            <div>
                <Navigation />
                <section>
                    <div>
                        <div className="md-grid">
                            <div className="md-cell md-cell--9">
                                <VideoCall
                                    caller={this.state.caller}
                                    clientId={this.state.clientId}
                                    socket={this.state.socket} />
                            </div>
                            <div className="md-cell md-cell--3">
                                <ChatBar
                                    socket={this.state.socket}
                                    id={this.state.socket.id}
                                    tutorialId={this.props.match.params.id}
                                    ready={this.props.match.params.id !== null} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}