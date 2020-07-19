import React from 'react';
import {TextField, Button, CardTitle} from 'react-md';
import {withRouter} from "react-router-dom";
import { toast } from "react-toastify";

class LoginTab extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            email: '',
            password: ''
        }
    }

    render() {
        return (
            <div className="md-grid" id="LoginTable" style={{
                width: '20%',
                marginTop: '10%',
                background: 'white',
                minWidth: '200px'
            }}>
                <form className="md-grid" onSubmit={this.handleSubmit}>
                    <CardTitle title="Login" id='LoginTitle' style={{
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}/>
                    <TextField
                        id="floating-center-email"
                        label="Email"
                        required
                        lineDirection="center"
                        placeholder="Please input your emailAddress"
                        className="md-cell md-cell--bottom"
                        style={{
                            marginTop: '-20px',
                            width: '100%'
                        }}
                        onChange={value => this.handleChange('email', value)}
                    />
                    <TextField
                        id="floating-password"
                        label="Password"
                        required
                        type="password"
                        className="md-cell md-cell--bottom"
                        style={{
                            marginTop: '-20px',
                            width: '100%'
                        }}
                        onChange={value => this.handleChange('password', value)}
                    />
                    <Button id="submit" type="submit"
                            flat primary swapTheming
                            style={{
                                marginTop: '10%',
                                marginLeft: 'auto',
                                marginRight: 'auto'}}>Login</Button>
                </form>
            </div>
        )
    }

    handleChange=(key, val) =>{
        this.setState({
            [key]: val
        })
    };

    isEmail = () => {
        if (this.state.email.search(/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1) {
            return true;
        } else {
            document.getElementById('floating-center-email').value = "Please input valid Email Address";
            document.getElementById('floating-center-email').focus();
            toast.error("Please input valid Email Address");
            return false;
        }
    };

    handleSubmit =(event) =>{
        if(event)
            event.preventDefault();

        if (!this.isEmail()) {
            return;
        }

        if (this.state.password.length < 8 ){
            document.getElementById('floating-password').label = "Password length must larger than 8";
            document.getElementById('floating-password').value = "";
            toast.error("Password length must larger than 8");
            return false;
        }

        let user = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.onSubmit(user);
    }
}

export default withRouter(LoginTab)