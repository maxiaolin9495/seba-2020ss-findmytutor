import React from 'react';
import _ from 'lodash';
import PeerConnection from './PeerConnection';
import MainWindow from './MainWindow';
import CallWindow from './CallWindow';
import CallModal from './CallModal';
import './app.scss';


export default class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: '',
            callWindow: '',
            callModal: '',
            callFrom: '',
            localSrc: null,
            peerSrc: null,
            caller: '',
            socket: null
        };
        this.pc = {};
        this.config = null;
        this.ifShareScreen = false;
        this.startCallHandler = this.startCall.bind(this);
        this.endCallHandler = this.endCall.bind(this);
        this.rejectCallHandler = this.rejectCall.bind(this);
        this.shareScreenHandler = this.shareScreen.bind(this);
    }


    componentDidUpdate(prevprops) {
        if (this.props.caller !== prevprops.caller) {
            this.setState({ caller: this.props.caller });
            this.setState({ clientId: this.props.clientId });

            if (this.props.caller && this.props.clientId) {
                const socket = this.props.socket;
                socket
                    .emit('init', ({ clientId: this.props.clientId }))
                    .on('init', ({ clientId: clientId }) => {
                        document.title = `${clientId} - VideoCall`;
                    })
                    .on('request', (data) => {
                        this.setState({ callModal: 'active', callFrom: data.from });
                    })
                    .on('call', (data) => {
                        if (data.sdp) {

                            this.pc.setRemoteDescription(data.sdp);
                            if (data.sdp.type === 'offer') {
                                this.pc.createAnswer();
                            }
                        } else {
                            this.pc.addIceCandidate(data.candidate);
                        }
                    })
                    .on('screenShare', (data) => {
                        if (data.sdp) {
                            this.pc.setRemoteDescriptionForShareScreen(data.sdp);
                            if (data.sdp.type === 'offer') {
                                this.pc.createAnswerForShareScreen();
                            }
                        } else {
                            this.pc.addIceCandidateForShareScreen(data.candidate);
                        }
                    })
                    .on('endScreenShare', () => {
                        this.pc.stopShareScreen(true);
                    })
                    .on('end', this.endCall.bind(this, false));
                this.setState({ socket: socket });
            }
        }
    }

    componentWillUnmount() {
        if (_.isFunction(this.pc.stop)) {
            this.pc.stop(false);
        }
    }

    startCall(isCaller, friendId, config) {
        this.config = config;
        this.pc = new PeerConnection(friendId, this.state.clientId, this.state.socket)
            .on('localStream', (src) => {
                const newState = { callWindow: 'active', localSrc: src };
                if (!isCaller) {
                    newState.callModal = '';
                }

                this.setState(newState);
            })
            .on('peerStream', (src) => {
                this.setState({ peerSrc: src })
            })
            .on('peerShareScreen', (src) => {
                this.setState({ peerSrc: src })
            })
            .start(isCaller, config);
    }

    shareScreen() {
        this.ifShareScreen = !this.ifShareScreen;
        if (this.ifShareScreen) {
            this.pc.shareScreen();
        } else {
            this.pc.stopShareScreen();
        }
    }

    rejectCall() {
        const { callFrom } = this.state;
        this.state.socket.emit('end', { to: callFrom });
        this.setState({ callModal: '' });
    }

    endCall(isStarter) {
        if (_.isFunction(this.pc.stop)) {
            this.pc.stop(isStarter);
        }
        this.pc = {};
        this.config = null;
        this.setState({
            callWindow: '',
            callModal: '',
            localSrc: null,
            peerSrc: null
        });
    }

    render() {
        const { clientId, callFrom, callModal, callWindow, localSrc, peerSrc } = this.state;
        return (
            <div>
                <MainWindow
                    clientId={clientId}
                    startCall={this.startCallHandler}
                    friendId={this.props.caller}
                />
                {!_.isEmpty(this.config) && (
                    <CallWindow
                        status={callWindow}
                        localSrc={localSrc}
                        peerSrc={peerSrc}
                        config={this.config}
                        mediaDevice={this.pc.mediaDevice}
                        endCall={this.endCallHandler}
                        shareScreen={this.shareScreenHandler}
                        ifShareScreen={this.ifShareScreen}
                    />
                )}
                <CallModal
                    status={callModal}
                    startCall={this.startCallHandler}
                    rejectCall={this.rejectCallHandler}
                    callFrom={callFrom}
                />
            </div>
        );
    }
}

