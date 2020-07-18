import React, { PureComponent } from 'react';
import { Button, DialogContainer, TextField, FontIcon } from 'react-md';
import { toast } from 'react-toastify';
import UserService from "../../Services/UserService";
import TutorPageService from "../../Services/TutorPageService";

export default class ContactDialog extends PureComponent {
    state = {
        visible: false,
        firstname: '',
        lastname: '',
        email: UserService.getCurrentUser().email || '',
        content: ''
    };

    show = () => {
        this.setState({ visible: true });
    };

    hide = () => {
        this.setState({ visible: false });
    };

    sendEmail = () => {
        if (!this.state.firstname || !this.state.lastname || !this.state.email || !this.state.content) {
            toast.error("Please fill in required message");
        }else{
            TutorPageService.contactTutor({
                customerFirstName: this.state.firstname,
                customerLastName: this.state.lastname,
                content: this.state.content,
                tutorFirstName: this.props.tutorFistName,
                tutorEmail: this.props.tutorEmail,
            }).then((data) => {
                this.setState({ visible: false });
                // console.log(this.state.firstname);
                // console.log(this.state.lastname);
                // console.log(this.state.content);
                // console.log(this.state.email);
                toast.success("Message successfully sent to tutor");
            }).catch((e) => {
                console.error(e);
                toast.error('Error by contact tutor');
            });         
        }
    }

    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }

    render() {
        const { visible } = this.state;

        const actions = [];
        actions.push({ secondary: true, children: 'Cancel', onClick: this.hide });
        actions.push(<Button flat primary onClick={this.sendEmail}>Send</Button>);

        return (
            <div>
                <Button
                    className="md-block-centered"
                    style={{
                        marginTop: '16px',
                        borderRadius: '30px',
                        border: '2px solid #00b0ff',
                        color: '#00b0ff'
                    }} flat
                    onClick={this.show} >CONTACT</Button>
                <DialogContainer
                    id="contact-dialog"
                    visible={visible}
                    onHide={this.hide}
                    actions={actions}
                    title="Contact"
                >
                    <TextField
                        style={{ padding: 0, margin: 0 }}
                        leftIcon={<FontIcon>person</FontIcon>}
                        type="text"
                        required={true}
                        id="contact-firstname-field"
                        label="Firstname"
                        placeholder="your firstname"
                        value={this.state.firstname}
                        onChange={(value) => this.handleChange('firstname', value)}
                        errorText="First name is required"
                    />
                    <TextField
                        style={{ padding: 0, margin: 0 }}
                        leftIcon={<FontIcon>person</FontIcon>}
                        required={true}
                        id="contact-lastname-field"
                        label="Lastname"
                        placeholder="your lastname"
                        value={this.state.lastname}
                        onChange={(value) => this.handleChange('lastname', value)}
                        errorText="Last name is required"
                        maxLength={20}
                    />
                    <TextField
                        style={{ padding: 0, margin: 0 }}
                        leftIcon={<FontIcon>email</FontIcon>}
                        id="contact-email-field"
                        label="Email"
                        required={true}
                        placeholder="your email"
                        value={this.state.email}
                        onChange={(value) => this.handleChange('email', value)}
                        errorText="Email is required"
                    />
                    <TextField
                        style={{ padding: 0, margin: 0 }}
                        leftIcon={<FontIcon>description</FontIcon>}
                        required={true}
                        onChange={(value) => this.handleChange('content', value)}
                        errorText="Content is required"
                        id="contact-content-field"
                        label="Content"
                        rows={1}
                        placeholder="write something here"
                        value={this.state.content}
                    />
                </DialogContainer>
            </div>
        );
    }
}