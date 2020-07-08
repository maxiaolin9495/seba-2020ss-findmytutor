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
        console.log(this.props.friendId);
        return () => this.props.friendId && this.props.startCall(true, this.props.friendId, config);
    };

    render() {
        return (
            /*
            <div>
              <h3>
                Hi, your ID is
                <input
                  type="text"
                  className="txt-clientId"
                  defaultValue={clientId}
                  readOnly
                />
              </h3>
              <h4>Get started by calling a friend below</h4>
            </div>
                <input
                type="text"
                className="txt-clientId"
                spellCheck={false}
                placeholder="Your friend ID"
                onChange={(event) => setFriendID(event.target.value)}
                />
             */
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

