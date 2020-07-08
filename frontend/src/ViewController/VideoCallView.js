import React from 'react';
import Navigation from "../UIcomponents/PageDesign/Navigation";
import VideoCall from "../UIcomponents/VideoCall/VideoCall";


export class VideoCallView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: []
        };
    }

    render() {
        setTimeout(() => window.scrollTo(0, 0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                   <VideoCall caller={this.props.match.params.email} ready={ this.props.match.params.email !== null}/>
                </section>
            </div>
        );
    }
}