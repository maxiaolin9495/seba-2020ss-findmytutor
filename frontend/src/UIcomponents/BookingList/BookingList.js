import React from 'react';
import { withRouter } from "react-router-dom";
import BookingCard from "./BookingCard";
import TutorialService from "../../Services/TutorialService";


class BookingList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {

        // this.setState({
        //     cards: props.filteredData.map(d => {
        //         console.log(d);
        //         return(<BookingCard
        //             key={d.id}
        //             tutor={d} />)
        //     })
        // })
    }
    // renderCards = () => {
    //     this.props.data.map(d => {
    //         return (<BookingCard
    //             key={d.id}
    //             tutor={d} />
    //         )
    //     });
    // };

    render() {
        let tutor = {
            firstName: "Hello",
            lastName: "World"
        };
        let tutorial = {
            tutorEmail: "1.2@3.cc",
            customerEmail: "ga26piq@mytum.de",
            sessionTopic: "Regression analysis",
            bookedTime: "Tue Jun 23 2020 21:14:43 GMT+0200 (Central European Summer Time)",
            price: "16",
            tutorialStatus: 'finished',
            transactionStatus: 'transferred',
            startTime: "Tue Jun 23 2020 22:00:00 GMT+0200 (Central European Summer Time)",
            endTime: "Tue Jun 23 2020 23:00:00 GMT+0200 (Central European Summer Time)"
        }

        return (<div>
            <BookingCard tutor={tutor} tutorial={tutorial} />
        </div>);
    }
}

export default withRouter(BookingList);