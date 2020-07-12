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
        this.createRTCPeerConnectionForScreenSharing();
        this.mediaDevice = new MediaDevice(true);
        this.friendId = friendId;
        this.clientId = clientId;
        this.socket = socket;
        this.ifShareScreen = false;
    }


    createRTCPeerConnectionForVideoCall(){
        if(this.pc){
            this.pc.close();
            this.pc = null;
        }
        this.pc = new RTCPeerConnection(PC_CONFIG);
        this.pc.onicecandidate = (event) => {
            socket.emit('call', {
                to: this.friendId,
                from: this.clientId,
                candidate: event.candidate
            });
        };
        this.pc.ontrack = (event) => {
            this.emit('peerStream', event.streams[0]);
        };

    }
    createRTCPeerConnectionForScreenSharing(){
        if(this.pc1){
            this.pc1.close();
            this.pc1 = null;
        }
        this.pc1 = new RTCPeerConnection(PC_CONFIG);
        this.pc1.onicecandidate = (event) => {
            socket.emit('screenShare', {
                to: this.friendId,
                from: this.clientId,
                candidate: event.candidate
            });
        };
        this.pc1.ontrack = (event) => {
            this.emit('peerShareScreen', event.streams[0]);
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
        this.pc.close();
        this.pc1.close();
        this.pc = null;
        this.pc1 = null;
        this.off();
        return this;
    }

    createOffer() {
        this.pc.createOffer()
            .then((desc) => {
                console.log('offer');
                this.getDescription(desc);
            })
            .catch((err) => console.log(err));
        return this;
    }

    createOfferForShareScreen() {
        this.pc1.createOffer()
            .then((desc) => {
                console.log('offer screen share');
                this.getDescriptionForShareScreen(desc);
            })
            .catch((err) => console.log(err));
        return this;
    }

    shareScreen() {
        if (this.ifShareScreen) {
            toast.error('Only one attendee can share his screen');
            return;
        }
        this.ifShareScreen = true;
        this.secondMediaDevice = new DesktopMediaDevice();
        this.secondMediaDevice
            .on('stream', (stream) => {
                stream.getTracks().forEach((track) => {
                    this.pc1.addTrack(track, stream);
                });
                this.createOfferForShareScreen();
            })
            .start();
        this.pc1.createOffer()
            .then((desc) => {
                console.log('screenShare');
                this.socket.emit('screenShare', {to: this.friendId, sdp: desc});
            })
            .catch((err) => console.log(err));

        return this;
    }

    stopShareScreen() {
        this.createOffer();
        this.ifShareScreen = false;
    }

    createAnswer() {
        this.pc.createAnswer()
            .then((desc) => {
                console.log('answer');
                this.getDescription(desc);
            })
            .catch((err) => console.log(err));
        return this;
    }


    getDescription(desc) {
        console.log('getDescription');
        this.pc.setLocalDescription(desc);
        this.pc1.setLocalDescription(desc);
        console.log('this.getDescription', this.friendId);
        this.socket.emit('call', {to: this.friendId, sdp: desc});
        return this;
    }

    getDescriptionForShareScreen(desc) {
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
        this.ifShareScreen = true;
        this.pc.close();
        this.createRTCPeerConnectionForVideoCall();
        const rtcSdp = new RTCSessionDescription(sdp);
        this.pc.setRemoteDescription(rtcSdp);
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
            const iceCandidate = new RTCIceCandidate(candidate);
            this.pc1.addIceCandidate(iceCandidate);
        }
        return this;
    }
}

export default PeerConnection;
