import React from 'react';
import PropTypes from 'prop-types';

export default class MainWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: '',
            friendId: ''
        }
    }


    /**
     * Start the call with or without video
     * @param {Boolean} video
     */
    callWithVideo = (video) => {
        const config = {audio: true, video};
        return () => this.props.friendId && this.props.startCall(true, this.props.friendId, config);
    };

    render() {
        return (

            <div className="container main-window">

                <div>

                    <div style={{
                        margin: "0px auto",
                        marginTop: "auto",
                        marginBottom: "auto",
                        float: "none",
                        display: "table"
                    }}>
                        <button
                            type="button"
                            className="phone"
                            onClick={this.callWithVideo(true)}
                        />
                        <button
                            type="button"
                            className="hangup"
                            onClick={this.callWithVideo(false)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired
};

