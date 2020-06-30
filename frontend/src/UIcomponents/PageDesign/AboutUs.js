import React from "react";
import {withRouter} from "react-router-dom";
import {CardTitle, CardText} from "react-md";


class AboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state={}
    }


    render(){
        return (<div className="md-grid" id="AboutUsTable"  style={{
            display: 'flex',
            width: '20%',
            margin: '0 auto',
            marginTop: '10%',
            background: 'white',
            minWidth: '200px'
        }}>
                <CardTitle title="About us" id='AboutUsTitle' style={{
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}/>
                <CardText>
                    <p>
                    FindMyTutor is platform that lists tutors from different universities to help informatics
learners and students to book personalized tutorial.
                    </p>
                </CardText>
        </div>)
    }
}
export default withRouter(AboutUs);