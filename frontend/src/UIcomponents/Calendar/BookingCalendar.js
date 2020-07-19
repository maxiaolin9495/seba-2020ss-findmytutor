import React from "react";
import {withRouter} from "react-router-dom";
import DatePicker from "react-datepicker";
import '../../Css/react-datepicker.css';
import PaymentDialog from "../PaymentDialog";
import {toast} from "react-toastify";
import TutorPageService from "../../Services/TutorPageService";
import {TextIconSpacing} from "@react-md/icon";
import {AccessAlarmFontIcon} from "@react-md/material-icons";
import './BookingCalendar.css';

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
            initialTimesForSpecificDayForStart: [],
            initialTimesForSpecificDayForEnd: [],
            price: 0,
            duration: 0,
            totalPrice: 0,
            minDate: undefined,
            initialDates: []
        };
    }

    componentDidMount() {
        //get initial available times
        let initials = [];
        let initialDates = [];
        TutorPageService.getTutorProfileById(this.props.match.params.id)
            .then((data) => {
                this.setState({price: data.price});
                data.timeSlotIds.forEach((times) => {
                    if (!times.ifBooked) {
                        initials.push({
                            start: new Date(parseInt(times.start)),
                            end: new Date(parseInt(times.end))
                        })
                    }
                });
                //add available dates and unit the start and end time to solve additional date problem
                data.timeSlotIds.forEach((times) => {
                    if (!times.ifBooked) {
                        initialDates.push({
                            start: new Date(parseInt(times.start)),
                            end: new Date(parseInt(times.start))
                        })
                    }

                });
                this.setState({initialTimes: initials});
                this.setState({initialDates: initialDates});
            })
    }

    //acquire time slots between start and end timestamp within one time period
    getSingleTimes = (startTimestamp, endTimestamp) => {
        let arr = [];
        let current = startTimestamp;
        while (current < endTimestamp - 1000) {
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
                        }
                    })
                }
            }

        });
        //change text in datepicker time header
        let a = document.querySelectorAll('.react-datepicker-time__header');
        if (a && a.length > 1) {
            a[0].innerText = 'Start';
            a[1].innerText = 'End';
        }

        return arr;

    };
    handleChangeStart = (value) => {
        let timeOnSpecificDayForStart = [];
        let timeOnSpecificDayForEnd = [];
        this.state.initialTimes.map((data) => {

            let dateDay = data.start.getDate();
            let dataForStart = {
                start: new Date(parseInt(data.start.getTime())),
                end: new Date(parseInt(data.end.getTime()))
            };
            let dataForEnd = {
                start: new Date(parseInt(data.start.getTime())),
                end: new Date(parseInt(data.end.getTime()))
            };
            if (value.getDate() === dateDay) {
                dataForStart.end.setHours(parseInt(data.end.getHours()) - 1);
                timeOnSpecificDayForStart.push(dataForStart);
                dataForEnd.start.setHours(parseInt(data.start.getHours()) + 1);
                timeOnSpecificDayForEnd.push(dataForEnd);
            }
        });

        //if startTime is chosen, app will match valid endTimes to be specified for the startTime
        for (let i = 0; i < timeOnSpecificDayForEnd.length; i++) {
            if (parseInt(timeOnSpecificDayForEnd[i].start.getHours()) <= parseInt(value.getHours()) &&
            parseInt(timeOnSpecificDayForEnd[i].end.getHours()) === 0 ?
                24 > parseInt(value.getHours()) :
                parseInt(timeOnSpecificDayForEnd[i].end.getHours()) > parseInt(value.getHours()) &&
                //avoid invalid ent times
                parseInt(value.getHours()) !== 0) {
                console.log(value);
                timeOnSpecificDayForEnd[i].start.setHours(parseInt(value.getHours()) + 1);
            }
        }
        this.setState({selectedStart: value});
        let tmpDate = new Date(value.getTime());
        tmpDate.setHours(0);
        tmpDate.setMinutes(0);
        this.setState({selectedEnd: tmpDate});
        this.setState({initialTimesForSpecificDayForStart: timeOnSpecificDayForStart});
        this.setState({initialTimesForSpecificDayForEnd: timeOnSpecificDayForEnd});
        this.setState({minDate: value});

    };

    handleChangeEnd = (value) => {
        let tmpSelectEnd;
        if (this.state.selectedStart) {
            tmpSelectEnd = new Date(this.state.selectedStart.getTime());
            tmpSelectEnd.setHours(value.getHours());
            tmpSelectEnd.setMinutes(value.getMinutes());
        } else {
            //this.setState({selectedEnd: undefined});
            tmpSelectEnd = value;

        }
        if (tmpSelectEnd.getHours() === 0) {
            tmpSelectEnd.setHours(24);
            this.setState({selectedEnd: tmpSelectEnd});
        } else {
            this.setState({selectedEnd: tmpSelectEnd});
        }


        let startTime = this.state.selectedStart.getHours();
        let endTime = tmpSelectEnd.getHours();
        if (endTime <= startTime &&
            this.state.selectedStart.getDay() === tmpSelectEnd.getDay()
        ) {
            toast.error('Invalid time selected!');
            this.setState({selectedEnd: undefined});
        } else {
            let duration;
            if (this.state.selectedStart.getDay() === tmpSelectEnd.getDay()) {
                duration = endTime - startTime;
            } else {
                duration = 24 - startTime;
            }

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

    handleCancel=()=>{
        this.setState({selectedStart:undefined});
        this.setState({selectedEnd:undefined});
    }

    render() {
        return (
            <div>
                <div style={{display: "flex"}}>
                    <DatePicker
                        id="newPickDate"
                        require
                        inline
                        includeDates={this.availableTimes(this.state.initialDates)}
                        includeTimes={this.availableTimes(this.state.initialTimesForSpecificDayForStart)}
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
                        includeDates={this.availableTimes(this.state.initialDates)}
                        includeTimes={this.availableTimes(this.state.initialTimesForSpecificDayForEnd)}
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
                               endTime={this.state.selectedEnd}
                               topic={this.props.topic}
                               selectedCourse={this.props.selectedCourse}
                               handleCancel={this.handleCancel} />
            </div>

        );
    }

}

export default withRouter(BookingCalendar);
