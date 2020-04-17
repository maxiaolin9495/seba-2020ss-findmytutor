import React from 'react';
import {withRouter} from "react-router-dom";
import {Button, TextField, CardTitle} from 'react-md';



class RegisterTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordConfirm: ''
        }
    }

    render() {
        return (
            <div className="md-grid" id="registrationTable"
                 style={{
                     width: '30%',
                     marginTop: '10%',
                     background: 'white'
                 }}>
                <CardTitle title="Register" id='RegisterTitle' style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    minWidth: '200px'
                }}/>
                <form className="md-grid" onSubmit={this.handleSubmit}>
                    <TextField
                        id="floating-center-email"
                        label="Email"
                        required
                        lineDirection="center"
                        placeholder="Please input your emailAddress"
                        onChange={value => this.handleChange('email', value)}
                    />
                    <TextField
                        id="floating-password"
                        label="Please Input your password"
                        required
                        type="password"
                        onChange={value => this.handleChange('password', value)}
                    />
                    <TextField
                        id="floating-password-confirm"
                        label="Confirm your password"
                        required
                        type="password"
                        onChange={value => this.handleChange('passwordConfirm', value)}
                    />
                    <Button id="submit" type="submit" flat primary swapTheming style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>Register</Button>
                </form>
            </div>
        )
    }

    onClick = () => {

    };

    isEmail = () => {
        if (this.state.email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1) {
            return true;
        } else {
            document.getElementById('floating-center-email').value = "Please input valid Email Address";
            document.getElementById('floating-center-email').focus();
            return false;
        }
    };
    verifyPassword = () => {
        if (this.state.password === this.state.passwordConfirm) {
            return true;
        } else {
            document.getElementById('floating-password-confirm').value = "";
            document.getElementById('floating-password').label = "Passwords are not matching";
            document.getElementById('floating-password').value = "";
            document.getElementById('floating-password').focus();
            return false;
        }
    };
    handleChange = (key, val) => {
        this.setState({
            [key]: val
        })
    };

    handleSubmit = (event) => {

        if (event)
            event.preventDefault();
        if (!this.isEmail() || !this.verifyPassword()) {
            return;
        }
        let user = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.onSubmit(user);
    }


}

export default withRouter(RegisterTab);
