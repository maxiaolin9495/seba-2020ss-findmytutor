import _ from 'lodash';
import Emitter from './Emitter';
import { toast } from "react-toastify";

/**
 * Manage all media devices
 */
class DesktopMediaDevice extends Emitter {

    constructor() {
        super();
    }


    /**
     * Start media devices and send stream
     */
    start() {
        if (navigator.getDisplayMedia) {
            navigator.getDisplayMedia({
                video: true,
                audio: true
            }).then((stream) => {
                this.stream = stream;
                this.emit('stream', stream);
            }).catch((err) => {
                if (err instanceof DOMException) {
                    toast.error('Cannot open desktop display');
                } else {
                    console.log(err);
                }
            });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            }).then((stream) => {
                this.stream = stream;
                this.emit('stream', stream);
            }).catch((err) => {
                if (err instanceof DOMException) {
                    toast.error('Cannot open desktop display');
                } else {
                    console.log(err);
                }
            });

        } else {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then((stream) => {
                this.stream = stream;
                this.emit('stream', stream);
            }).catch((err) => {
                if (err instanceof DOMException) {
                    toast.error('Cannot open desktop display');
                } else {
                    console.log(err);
                }
            })
        }

        return this;
    }

    /**
     * Turn on/off a device
     * @param {String} type - Type of the device
     * @param {Boolean} [on] - State of the device
     */
    toggle(type, on) {
        const len = arguments.length;
        if (this.stream) {
            this.stream[`get${type}Tracks`]().forEach((track) => {
                const state = len === 2 ? on : !track.enabled;
                _.set(track, 'enabled', state);
            });
        }
        return this;
    }

    /**
     * Stop all media track of devices
     */
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
        }
        return this;
    }
}

export default DesktopMediaDevice;
