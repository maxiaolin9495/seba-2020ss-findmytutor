import React from "react";
import Background from "../Images/Homepage.jpg";
import LoginTab from "../UIcomponents/pageDesign/Login";
import LoginService from "../Services/LoginService";
import { toast } from 'react-toastify';

export class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    login = (user) => {
        LoginService.login(user.email, user.password, user.userType).then(() => {
            toast.success('Login succeeded');
            this.props.history.push('/');

        }).catch((e) => {
            toast.error('Please input correct email and password');
            document.getElementById('floating-password').value = '';
            this.setState({
                error: e
            });
        });
    };

    render() {
        setTimeout(() => window.scrollTo(0, 0), 150);
        return (
            <section>
                <img src={Background} alt={"A Background Picture"} className="bg"/>
                <LoginTab onSubmit={(user) => this.login(user)} error={this.state.error}/>
            </section>

        )
    }
}