import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


export default class CallModal extends React.Component {

    constructor(props) {
        super(props);
    }

    acceptWithVideo = (video) => {
        const config = {audio: true, video};
        return () => this.props.startCall(false, this.props.callFrom, config);
    };

    render() {
        return (
            <div className={classNames('call-modal', this.props.status)}>
                <p>
                    <span className="caller">{`${this.props.callFrom} is calling`}</span>
                </p>
                <button
                    type="button"
                    className="video"
                    onClick={this.acceptWithVideo(true)}
                />
                <button
                    type="button"
                    className="microphone"
                    onClick={this.acceptWithVideo(false)}
                />
                <button
                    type="button"
                    className="hangup"
                    onClick={this.props.rejectCall}
                />
            </div>
        );
    }


}

CallModal.propTypes = {
  status: PropTypes.string.isRequired,
  callFrom: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
  rejectCall: PropTypes.func.isRequired
};
