import React, {PureComponent} from 'react';
import {withRouter} from "react-router-dom";
import {DialogContainer, Button} from 'react-md';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import {toast} from "react-toastify";
import TutorPageService from "../Services/TutorPageService";
import TutorialService from "../Services/TutorialService";
import UserService from "../Services/UserService";

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
        console.log(res);
        toast.success('Successful payment');
        this.hide();
       // let bookedTimes=[];
        let booking={
            tutorFirstName:this.state.tutor.firstName,
            tutorEmail: this.state.tutor.email,
            customerEmail:UserService.getCurrentUser().email,
            sessionTopic:'topic',
            bookedTime:this.props.duration,
            price:this.props.totalPrice,
            tutorialStatus: 'notConfirmed',
            transactionStatus: 'paid',
            startTime:this.props.startTime.getTime(),
            endTime:this.props.endTime.getTime()

        };
        console.log(booking);
       TutorialService.createBooking(booking);

    };
    componentDidMount() {
        TutorPageService.getTutorProfileById(this.props.match.params.id).then((tutor)=>{
            this.setState({tutor:tutor});
        })
    }

    render() {

        const client = {
            sandbox: 'AQmkwXCQvzEjf2jUqdTvG3hb_I9DlgZ0ahbE9cit9Izrvh0Wtz5cFTV_ZpZ4ICBS9tbc1zD94Hzdms7i'
        };

        return (
            <div style={{marginTop: 'auto', marginLeft: 'auto', marginRight: 'auto'}}>
                <Button id="pay"
                        raised primary swapTheming
                        onClick={this.handleClick} style={{marginLeft: '17px'}}>Pay</Button>
                <DialogContainer
                    id="scrolling-content-dialog"
                    title='Confirm your Booking'
                    initialFocus="some-element-id"
                    visible={this.state.visible}
                    focusOnMount={false}
                    onHide={this.hide}
                    actions={
                        <PaypalExpressBtn
                            client={client}
                            total={this.props.totalPrice}
                            currency={'EUR'}
                            onSuccess={(res) => this.paymentSuccess(res)}
                            onError={(msg) => {
                                toast('Unsuccessful payment')
                            }}
                            env='sandbox'
                        />
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