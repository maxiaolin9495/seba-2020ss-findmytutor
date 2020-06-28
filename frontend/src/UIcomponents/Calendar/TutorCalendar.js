import React from "react";
import {withRouter} from "react-router-dom";
import AvailableTimes from "react-available-times";
import { toast } from "react-toastify";


class TutorCalendar extends React.Component {
    constructor(props) {
        super(props);
        let tmp = [];
        props.timeSlotIds.forEach((times) => {
            tmp.push({
                start: new Date(parseInt(times.start)),
                end: new Date(parseInt(times.end))
            })
        });
        let result = this.verifySelectionsWithInvalidDate(tmp);
        this.state = {
            initialTimes: result.selections,
            timeSlots: <div/>,
            finalTimes: []
        };
    }

    isDateBeforeToday = (date) => {
        return new Date(date.toDateString()) < new Date(new Date().toDateString());
    };

    verifySelectionsWithInvalidDate = (selections) => {
        let tmpSelections = [];
        let valid = true;
        for (let i = 0; i < selections.length; i++) {
            console.log(selections[i]);
            if (this.isDateBeforeToday(selections[i].start)) {
                //   toast.error('Invalid date selected');
                valid = false;
            } else {
                tmpSelections[tmpSelections.length] = selections[i];
            }
        }
        return {selections: tmpSelections, valid: valid};
    };

    handleChange = (selections) => {
        let result = this.verifySelectionsWithInvalidDate(selections);
        if (!result.valid) {
            toast.error('Invalid date selected');
        }

        selections = result.selections;
        let arr = [];
        selections.forEach((data) => {

            // if a timeSlot with the same startTime & endTime is found, then we use its ifBooked Value, else use the default value false
            let a = this.props.timeSlotIds.find(
                timeSlot => timeSlot.start === data.start.getTime()
                    && timeSlot.end === data.end.getTime()
            );
            arr.push({
                start: data.start.getTime(),
                end: data.end.getTime(),
                ifBooked: a ?
                    a.ifBooked :
                    false
            })
        });
        console.log(arr);
        this.setState({
            initialTimes: selections
        });
        this.props.sendTimeSlots(arr);
    };


    render() {
        return (
            <div>
                <AvailableTimes
                    weekStartsOn="monday"
                    //save selected time slots
                    onChange={this.handleChange}
                    width={500}
                    height={600}
                    timeConvention="24h"
                    start={new Date()}
                    recurring={false}
                    initialSelections={
                        this.state.initialTimes
                    }
                    availableDays={['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']}
                    availableHourRange={{ start: 6, end: 24 }}
                />
            </div>

        );
    }

}

export default withRouter(TutorCalendar);