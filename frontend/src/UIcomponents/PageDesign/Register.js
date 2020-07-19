import React from 'react';
import {withRouter} from "react-router-dom";
import {Button, TextField, CardTitle, SelectField} from 'react-md';
import { toast } from 'react-toastify';

const USER_TYPE = ['customer', 'tutor'];

class RegisterTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordConfirm: '',
            userType: ''
        }
    }

    handleUserType=(value)=>{
        this.state.userType = value
    };

    render() {
        return (
            <div className="md-grid" id="registrationTable"
                 style={{
                     width: '20%',
                     marginTop: '10%',
                     background: 'white',
                     minWidth: '200px'
                 }}>
                <CardTitle title="Register" id='RegisterTitle' style={{
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}/>
                <form className="md-grid" onSubmit={this.handleSubmit}>
                    <SelectField
                        id="select-field-styling-1"
                        label="userType"
                        placeholder="Please choose your userType"
                        itemLabel="userType"
                        menuItems={USER_TYPE}
                        className="md-cell"
                        required
                        onChange={this.handleUserType}
                        errorText="This field is required"
                        style={{
                            width: '100%'
                        }}
                    />
                    <TextField
                        id="floating-center-email"
                        label="Email"
                        required
                        lineDirection="center"
                        placeholder="Please input your emailAddress"
                        onChange={value => this.handleChange('email', value)}
                        className="md-cell md-cell--bottom"
                        style={{
                            marginTop: '-20px',
                            width: '100%'
                        }}
                    />
                    <TextField
                        id="floating-password"
                        label="Please Input your password"
                        required
                        type="password"
                        onChange={value => this.handleChange('password', value)}
                        className="md-cell md-cell--bottom"
                        style={{
                            width: '100%'
                        }}
                    />
                    <TextField
                        id="floating-password-confirm"
                        label="Confirm your password"
                        required
                        type="password"
                        onChange={value => this.handleChange('passwordConfirm', value)}
                        className="md-cell md-cell--bottom"
                        style={{
                            width: '100%'
                        }}
                    />
                    <Button id="submit" type="submit" flat primary swapTheming style={{
                        marginTop: '10px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>Register</Button>
                </form>
            </div>
        )
    }

    isEmail = () => {
        if (this.state.email.search(/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1) {
            return true;
        } else {
            document.getElementById('floating-center-email').value = "Please input valid Email Address";
            document.getElementById('floating-center-email').focus();
            return false;
        }
    };
    verifyPassword = () => {
        if (this.state.password.length < 8 ){
            this.setState({
                password: '',
                passwordConfirm: ''
            });
            document.getElementById('floating-password').label = "Password length must larger than 8";
            document.getElementById('floating-password-confirm').value = "";
            document.getElementById('floating-password').value = "";
            document.getElementById('floating-password').focus();
            toast.error('Password length must longer than 8');
            return false;
        }


        if(this.state.password.search(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) === -1){
            toast.error('The password must contain at least 1 lowercase and 1uppercase alphabetical and 1 numerical character');
            document.getElementById('floating-password-confirm').value = "";
            document.getElementById('floating-password').value = "";
            document.getElementById('floating-password').focus();
            return false;
        }
        if ( this.state.password === this.state.passwordConfirm) {
            return true;
        } else {
            toast.error("Password does not match");
            this.setState({
                password: '',
                passwordConfirm: ''
            });
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
        if(this.state.userType === ''){
            toast.error('You need first choose a userType');
            return
        }
        if (event)
            event.preventDefault();
        if (!this.isEmail() || !this.verifyPassword()) {
            return;
        }
        let user = {
            email: this.state.email,
            password: this.state.password,
            userType: this.state.userType
        };

        this.props.onSubmit(user);
    }


}

export default withRouter(RegisterTab);
