import React from "react";
import {withRouter} from "react-router-dom";
import DatePicker from "react-datepicker";
import '../../Css/react-datepicker.css';
import PaymentDialog from "../PaymentDialog";
import { toast } from "react-toastify";
import TutorPageService from "../../Services/TutorPageService";
import TutorialService from "../../Services/TutorialService";
import {TextIconSpacing} from "@react-md/icon";
import {AccessAlarmFontIcon} from "@react-md/material-icons";

const stylePicker = {
    display: "contents",
    marginTop: 50,
    marginLeft: 50
};

class BookingCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialTimes: [],
            selectedStart: undefined,
            selectedEnd: undefined,
            initialTimesForSpecificDay: [],
            price: 0,
            duration: 0,
            totalPrice: 0,
            bookedTimes: [],
            bookingTimesForSpecificDay: [],
            minDate: undefined,
        };
    }

    componentDidMount() {
        //get initial available times
        let initials = [];
        TutorPageService.getTutorProfileById(this.props.match.params.id).then((data) => {
            this.setState({price: data.price});
            console.log(data);
            data.timeSlotIds.forEach((times) => {
                initials.push({
                    start: new Date(parseInt(times.start)),
                    end: new Date(parseInt(times.end))
                })
            });
            this.setState({initialTimes: initials});
            //get booked times
            let bookedTimes = [];
            TutorialService.getAllTutorials(this.props.match.params.id).then((bookings) => {
                bookings.map((data) => {
                    bookedTimes.push({
                        start: new Date(parseInt(data.startTime)),
                        end: new Date(parseInt(data.endTime)),
                    })
                });
                this.setState({bookedTimes: bookedTimes});

            })

        })

    }

    //acquire time slots between start and end timestamp within one time period
    getSingleTimes = (startTimestamp, endTimestamp) => {
        let arr = [];
        let current = startTimestamp;
        while (current < endTimestamp) {
            arr.push(new Date(parseInt(current)));
            current += 60 * 60 * 1000;
        }
        arr.push(new Date(parseInt(endTimestamp)));
        return arr;
    };

    //get all time slots in time array
    availableTimes = (initials) => {
        let arr = [];
        initials.forEach((data) => {
            if (data.start !== undefined && data.end !== undefined) {
                let startStp = data.start.getTime();
                let endStp = data.end.getTime();
                let newArr = this.getSingleTimes(startStp, endStp);
                if (newArr !== null && newArr !== undefined) {
                    newArr.forEach((data) => {
                        if (arr.indexOf(data) === -1) {
                            arr.push(data);
                            //    console.log(arr)
                        }
                    })
                }
            }

        });
        return arr;
    };
    handleChangeStart = (value) => {
        let timeOnSpecificDay = [];
        this.state.initialTimes.map((data) => {
            let dateDay = data.start.getDate();
            if (value.getDate() === dateDay) {
                timeOnSpecificDay.push(data);
            }
        });
        let bookingOnSpecificDay = [];
        this.state.bookedTimes.map((data) => {
            let dateDay = data.start.getDate();
            if (value.getDate() === dateDay) {
                bookingOnSpecificDay.push(data);
            }
        });
        this.setState({selectedStart: value});
        let tmpDate = new Date();
        tmpDate.setHours(0);
        tmpDate.setMinutes(0);
        tmpDate.setDate(value.getDate());
        this.setState({selectedEnd: tmpDate});
        this.setState({initialTimesForSpecificDay: timeOnSpecificDay});
        this.setState({minDate: value});
        this.setState({bookingTimesForSpecificDay: bookingOnSpecificDay});


    };

    handleChangeEnd = (value) => {
        this.setState({selectedEnd: value});
        let startTime = this.state.selectedStart.getHours();
        let endTime = value.getHours();
        if (endTime <= startTime) {
            toast.error('Invalid time selected!');
            this.setState({selectedEnd: undefined});
        } else {
            let duration = endTime - startTime;
            this.setState({duration: duration});
            this.setState({totalPrice: duration * this.state.price})
        }
    };

    //get and display start and end time
    getTime = (timestamp) => {
        if (timestamp === undefined) {
            return '';
        }
        let timeHour = timestamp.getHours();
        let timeMin = timestamp.getMinutes();
        if (timestamp.getHours() < 10) {
            timeHour = '0' + timestamp.getHours();
        }
        if (timestamp.getMinutes() < 10) {
            timeMin = '0' + timestamp.getMinutes();
        }
        return timestamp.toDateString() + ' ' + timeHour + ":" + timeMin;
    };

    render() {
        return (
            <div>
                <div style={{display: "flex"}}>
                    <DatePicker
                        id="newPickDate"
                        require
                        inline
                        includeDates={this.availableTimes(this.state.initialTimes)}
                        includeTimes={this.availableTimes(this.state.initialTimesForSpecificDay)}
                        excludeTimes={this.availableTimes(this.state.bookingTimesForSpecificDay)}
                        timesShown={2}
                        style={stylePicker}
                        dateFormat='dd.MM.yyyy HH:mm'
                        className="md-cell"
                        selected={this.state.selectedStart}
                        isClearable
                        showYearDropdown
                        scrollableMonthYearDropdown
                        minDate={new Date()}
                        onChange={this.handleChangeStart}
                        showTimeSelect
                        timeIntervals={60}
                        timeCaption="Time"
                        timeFormat="HH:mm"

                    />
                    <DatePicker
                        id="newPickDateEnd"
                        require
                        inline
                        style={stylePicker}
                        dateFormat='dd.MM.yyyy HH:mm'
                        className="md-cell"
                        selected={this.state.selectedEnd}
                        includeDates={this.availableTimes(this.state.initialTimes)}
                        includeTimes={this.availableTimes(this.state.initialTimesForSpecificDay)}
                        excludeTimes={this.availableTimes(this.state.bookingTimesForSpecificDay)}
                        isClearable
                        minDate={this.state.minDate}
                        //   minTime={new Date()}
                        onChange={this.handleChangeEnd}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={60}
                        timeCaption="Time"
                        timeFormat="HH:mm"

                    />

                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    <TextIconSpacing icon={<AccessAlarmFontIcon style={{opacity: 0.6}}/>}> Selected
                        time: </TextIconSpacing>
                    <p style={{
                        verticalAlign: "baseline",
                        marginTop: 12,
                        marginLeft: 5
                    }}> {this.getTime(this.state.selectedStart)}</p>
                    <p style={{
                        verticalAlign: "baseline",
                        marginTop: 12,
                        marginLeft: 5
                    }}> - {this.getTime(this.state.selectedEnd)}</p>
                </div>
                <PaymentDialog totalPrice={this.state.totalPrice}
                               duration={this.state.duration}
                               startTime={this.state.selectedStart}
                               endTime={this.state.selectedEnd}/>
            </div>

        );
    }

}

export default withRouter(BookingCalendar);