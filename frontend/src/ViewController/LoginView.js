import React from "react";
import Navigation from "../UIcomponents/pageDesign/Navigation";
import Background from "../Images/Homepage.jpg";
import LoginTab from "../UIcomponents/pageDesign/Login";
import LoginService from "../Services/LoginService";

export class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    login=(user) =>{
        LoginService.login(user.email, user.password).then(() => {
            this.props.history.push('/');
        }).catch((e) => {
            alert('Please input correct email and password');
            document.getElementById('floating-password').value = '';
            this.setState({
                error: e
            });
        });
    };

    render(){
        setTimeout(() => window.scrollTo(0,0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                    <img src={Background} alt={"Ein Hintergrundbild"} className="bg"/>
                    <LoginTab  onSubmit={(user) => this.login(user)} error={this.state.error}/>
                </section>
            </div>

        )
    }
}