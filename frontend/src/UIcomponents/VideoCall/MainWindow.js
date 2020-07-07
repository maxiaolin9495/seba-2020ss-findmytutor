import React, { useState } from 'react';
import PropTypes from 'prop-types';

function MainWindow({ startCall, clientId }) {
  const [friendID, setFriendID] = useState(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

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

          <div style={{margin: "0px auto",
              marginTop: "auto",
              marginBottom: "auto",
              float: "none",
              display: "table"}}>
          <button
            type="button"
            className="phone"
            onClick={callWithVideo(true)}
          />
          <button
            type="button"
            className="hangup"
            onClick={callWithVideo(false)}
          />
        </div>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired
};

export default MainWindow;
