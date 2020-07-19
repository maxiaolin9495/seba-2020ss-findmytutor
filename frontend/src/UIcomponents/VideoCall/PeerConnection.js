import MediaDevice from './MediaDevice';
import Emitter from './Emitter';
import DesktopMediaDevice from "./DesktopMediaDevice";
import { toast } from "react-toastify";

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class PeerConnection extends Emitter {
    /**
     * Create a PeerConnection.
     * @param {String} friendId - ID of the friend you want to call.
     * @param {String} clientId - ID of the client, who call the client.
     * @param {String} socket - socket, which is used to make video call.
     */
    constructor(friendId, clientId, socket) {
        super();
        this.createRTCPeerConnectionForVideoCall();
        this.mediaDevice = new MediaDevice();
        this.friendId = friendId;
        this.clientId = clientId;
        this.socket = socket;
        this.ifShareScreen = false;
        this.isSharing = false;
        this.peerStream = null;
        this.localStream = null;
    }


    createRTCPeerConnectionForVideoCall(){
        if(this.pc){
            this.pc.close();
            this.pc = null;
        }
        this.pc = new RTCPeerConnection(PC_CONFIG);
        this.pc.onicecandidate = (event) => {
            if(!this.ifShareScreen) {
                this.socket.emit('call', {
                    to: this.friendId,
                    from: this.clientId,
                    candidate: event.candidate
                });
            }
        };
        this.pc.ontrack = (event) => {
            if(!this.ifShareScreen) {
                this.peerStream = event.streams[0];
                this.emit('peerStream', event.streams[0]);
            }
        };

    }
    createRTCPeerConnectionForScreenSharing(){
        if(this.pc1){
            this.pc1.close();
            this.pc1 = null;
        }
        this.pc1 = new RTCPeerConnection(PC_CONFIG);
        this.pc1.onicecandidate = (event) => {
            if(this.ifShareScreen) {
                this.socket.emit('screenShare', {
                    to: this.friendId,
                    from: this.clientId,
                    candidate: event.candidate
                });
            }
        };
        this.pc1.ontrack = (event) => {
            if(this.ifShareScreen) {
                this.emit('peerShareScreen', event.streams[0]);
            }
        };

    }
    /**
     * Starting the call
     * @param {Boolean} isCaller
     * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
     */
    start(isCaller, config) {
        this.mediaDevice
            .on('stream', (stream) => {
                stream.getTracks().forEach((track) => {
                    this.pc.addTrack(track, stream);
                });
                this.localStream = stream;
                this.emit('localStream', stream);
                if (isCaller) {
                    this.socket.emit('request', {to: this.friendId, from: this.clientId});
                }
                else {
                    this.createOffer();
                }
            })
            .start(config);
        this.config = config;
        return this;
    }

    /**
     * Stop the call
     * @param {Boolean} isStarter
     */
    stop(isStarter) {
        if (isStarter) {
            this.socket.emit('end', {to: this.friendId, from: this.clientId});
        }
        this.mediaDevice.stop();
        if (this.secondMediaDevice) {
            this.secondMediaDevice.stop();
        }
        if(this.pc){
            this.pc.close();
            this.pc = null;
        }
        if(this.pc1){
            this.pc1.close();
            this.pc1 = null;
        }
        this.off();
        return this;
    }

    createOffer() {
        this.pc.createOffer()
            .then((desc) => {
                this.getDescription(desc);
            })
            .catch((err) => console.log(err));
        return this;
    }

    createOfferForShareScreen() {
        this.pc1.createOffer()
            .then((desc) => {
                this.getDescriptionForShareScreen(desc);
            })
            .catch((err) => console.log(err));
        return this;
    }

    shareScreen() {
        if (this.isSharing || this.ifShareScreen) {
            toast.error('Only one attendee can share his screen');
            return;
        }

        //we assure, each time only one RTC Connection in work, thus we prevent resource misused.
        if(this.pc){
            this.pc.close();
            this.pc = null;
        }

        this.createRTCPeerConnectionForScreenSharing();
        //set sharing Status
        this.ifShareScreen = true;
        this.isSharing = true;
        //capture screen
        this.secondMediaDevice = new DesktopMediaDevice();
        this.secondMediaDevice
            .on('stream', (stream) => {
                stream.getTracks().forEach((track) => {
                    this.pc1.addTrack(track, stream);
                });
                this.createOfferForShareScreen();
            })
            .start();
        return this;
    }

    stopShareScreen(ifEnd) {
        // a sharer can choose to stop screen sharing
        if (this.isSharing && this.ifShareScreen) {
            //remove screen capturing
            this.secondMediaDevice.stop();
            this.secondMediaDevice = null;
            this.isSharing = false;
            this.ifShareScreen = false;
            this.socket.emit('endScreenShare', {to: this.friendId, from: this.clientId});
            this.resetPeerConnection();

            return;
        }
        //or receive the notification, that the screen sharing is stopped;
        if (ifEnd && this.ifShareScreen) {
            this.resetPeerConnection();
            this.createOffer();
            return;
        }
        toast.error('You are not allowed to stop screen share');
    }

    /*close the RTCPeerConnection, which used to share screen, create a new RTCPeerConnection
        to share the selfie video stream*/
    resetPeerConnection () {
        this.pc1.close();
        this.pc1 = null;
        this.ifShareScreen = false;
        if(this.pc) {
            this.pc.close();
            this.pc = null;
        }
        this.createRTCPeerConnectionForVideoCall()
        this.localStream.getTracks().forEach((track) => {
            this.pc.addTrack(track, this.localStream);
        })

    }

    createAnswer() {
        this.pc.createAnswer()
            .then((desc) => {
                this.getDescription(desc);
            })
            .catch((err) => console.log(err));
        return this;
    }

    createAnswerForShareScreen() {
        this.pc1.createAnswer()
            .then((desc) => {
                this.getDescriptionForShareScreen(desc);
            })
            .catch((err) => console.log(err));
        return this;
    }


    getDescription(desc) {
        this.pc.setLocalDescription(desc);
        this.socket.emit('call', {to: this.friendId, sdp: desc});
        return this;
    }

    getDescriptionForShareScreen(desc) {
        this.pc1.setLocalDescription(desc);
        this.socket.emit('screenShare', {to: this.friendId, sdp: desc});
        return this;
    }

    /**
     * @param {Object} sdp - Session description
     */
    setRemoteDescription(sdp) {
        const rtcSdp = new RTCSessionDescription(sdp);
        this.pc.setRemoteDescription(rtcSdp);
        return this;
    }

    setRemoteDescriptionForShareScreen(sdp) {
        //we assure, each time only one RTC Connection in work, thus we prevent resource misused.
        if(this.pc){
            this.pc.close();
            this.pc = null;
        }
        if(! this.pc1) {
            this.createRTCPeerConnectionForScreenSharing();
            //set localStream for the remote sender
            this.localStream.getTracks().forEach((track) => {
                this.pc1.addTrack(track, this.localStream);
            })

        }
        this.ifShareScreen = true;
        this.createRTCPeerConnectionForVideoCall();
        const rtcSdp = new RTCSessionDescription(sdp);
        this.pc1.setRemoteDescription(rtcSdp);
        return this;
    }

    /**
     * @param {Object} candidate - ICE Candidate
     */
    addIceCandidate(candidate) {
        if (candidate) {
            const iceCandidate = new RTCIceCandidate(candidate);
            this.pc.addIceCandidate(iceCandidate);
        }
        return this;
    }

    addIceCandidateForShareScreen(candidate) {
        if (candidate) {
            if(! this.pc1){
                this.createRTCPeerConnectionForScreenSharing();
            }
            const iceCandidate = new RTCIceCandidate(candidate);
            this.pc1.addIceCandidate(iceCandidate);
        }
        return this;
    }
}

export default PeerConnection;
