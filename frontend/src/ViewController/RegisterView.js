import React from "react";
import Navigation from "../UIcomponents/pageDesign/Navigation";
import Background from "../Images/Homepage.jpg";
import RegisterTab from "../UIcomponents/pageDesign/Register";
import RegisterService from "../Services/RegisterService";

export class RegisterView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    register=(user)=> {
        RegisterService.register(user.email, user.password).then((data) => {
            this.props.history.push('/');
        }).catch((e) => {
            console.error(e);
            this.setState({
                error: e
            });
        })
    };

    render() {
        setTimeout(() => window.scrollTo(0,0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                    <img src={Background} alt={"Ein Hintergrundbild"} className="bg"/>
                    <RegisterTab onSubmit={(user) => this.register(user)} error={this.state.error}/>
                </section>
            </div>

        )

    }
}