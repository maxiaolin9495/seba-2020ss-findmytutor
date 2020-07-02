import React, {PureComponent} from 'react';
import {withRouter} from "react-router-dom";
import {DialogContainer, Button} from 'react-md';
import { toast } from "react-toastify";
import TutorPageService from "../Services/TutorPageService";
import TutorialService from "../Services/TutorialService";
import UserService from "../Services/UserService";
import {PayPalButton} from "react-paypal-button";
import TransactionService from "../Services/TransactionService";

class PaymentDialog extends PureComponent {
    constructor(props) {
        super(props);

    }

    state = {
        visible: false,
        tutor: undefined
    };


    show = () => {
        this.setState({visible: true});
    };
    hide = () => {
        this.setState({visible: false});
    };
    handleClick = () => {
        this.show();
    };

    paymentSuccess = (res) => {
        toast.success('Successful payment');
        this.hide();
        let booking = {
            tutorFirstName: this.state.tutor.firstName,
            tutorEmail: this.state.tutor.email,
            customerEmail: UserService.getCurrentUser().email,
            sessionTopic: 'topic',
            bookedTime: new Date(res.create_time).getTime(),
            price: this.props.totalPrice,
            tutorialStatus: 'notConfirmed',
            transactionStatus: 'paid',
            startTime: this.props.startTime.getTime(),
            endTime: this.props.endTime.getTime()

        };
        let transaction ={
            payer:UserService.getCurrentUser().email,
            receiver:this.state.tutor.email,
            transactionStatus: 'transferred',
        }

        console.log(booking);
        TutorialService.createBooking(booking);
        TransactionService.createTransaction(transaction);
        // this.props.history.push('tutor/' + this.props.match.params.id);
    };

    componentDidMount() {
        TutorPageService.getTutorProfileById(this.props.match.params.id).then((tutor) => {
            this.setState({tutor: tutor});
        })
    }

    render() {
        const paypalOptions = {
            clientId: 'AWPgjWf8cLTULocPUgRLv-1fIJwSjBG7SrYqzzgF6BoYuhgXfSI2BzTvPn-DXVqx5WxtjEfRrChDZGWi',
            intent: 'capture',
            currency: 'EUR'
        };
        return (
            <div style={{marginTop: 'auto', marginLeft: 'auto', marginRight: 'auto'}}>
                <Button id="pay"
                        raised primary swapTheming
                        onClick={this.handleClick} style={{marginLeft: '17px'}}>Pay</Button>
                <Button id="cancel"
                        raised secondary swapTheming
                        style={{marginLeft: '17px'}}>Cancel</Button>
                <DialogContainer
                    id="scrolling-content-dialog"
                    title='Confirm your Booking'
                    initialFocus="some-element-id"
                    visible={this.state.visible}
                    focusOnMount={false}
                    onHide={this.hide}
                    actions={
                        <PayPalButton
                            amount={this.props.totalPrice}
                            onPaymentStart={() => {
                                console.log('payment started')
                            }}
                            onPaymentSuccess={(res) => this.paymentSuccess(res)}
                            onPaymentError={(msg) => {
                                toast.error('Unsuccessful payment');
                                console.log(msg)
                            }}
                            onPaymentCancel={(msg) => {
                            }}
                            paypalOptions={paypalOptions}
                            env='sandbox'/>
                    }
                >

                    <p>
                        Please choose a payment method.
                    </p>
                </DialogContainer>
            </div>
        )

    }
}

export default withRouter(PaymentDialog);