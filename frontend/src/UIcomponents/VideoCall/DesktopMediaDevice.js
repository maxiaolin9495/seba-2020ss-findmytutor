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
            return navigator.getDisplayMedia({
                video: true,
                audio: true
            });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            return navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });
        } else {
            return navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
        }

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
