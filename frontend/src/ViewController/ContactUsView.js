import React from 'react';
import ContactUs from '../UIcomponents/PageDesign/ContactUs';
import Background from "../Images/Homepage.jpg";
import UserService from "../Services/UserService";
import { toast } from 'react-toastify';
import Navigation from "../UIcomponents/PageDesign/Navigation";

export class ContactUsView extends React.Component {
    validateInputs = (email) => {
        if (this.isEmail(email)) {
            return true;
        }
        else {
            toast.error('Please input valid email address');
            return false;
        }
    };
    send = (contactForm) => {
        if (!this.validateInputs()) return;
        UserService.uploadMessage(contactForm.message, contactForm.email)
            .then(() => {
                toast.success("Message successfully sent out");
                this.props.history.push('/');
            }).catch(e => {
            console.log(e);
            toast.error(e);
        });
    };

    isEmail = () => {
        let strEmail = document.getElementById('floating-center-email').value;
        if (strEmail.search(/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1) {
            return true;
        } else {
            document.getElementById('floating-center-email').value = '';
            document.getElementById('floating-center-email').focus();
            return false;
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
        };
    }

    render() {
        setTimeout(() => window.scrollTo(0, 0), 150);
        return (
            <div>
                <Navigation/>
                <section>
                    <img src={Background} className="bg" alt={'Background'}/>
                    <ContactUs onSubmit={(contactForm) => this.send(contactForm)} error={this.state.error}/>
                </section>
            </div>
        );
    }
}