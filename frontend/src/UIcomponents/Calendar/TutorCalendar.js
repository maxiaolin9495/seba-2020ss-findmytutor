import React from "react";
import {withRouter} from "react-router-dom";
import { toast } from "react-toastify";
import ModifiedAvailableTimes from "./AvailableTimes.js";

class TutorCalendar extends React.Component {
    constructor(props) {
        super(props);
        let tmp = [];
        props.timeSlotIds.forEach((times) => {
            tmp.push({
                start: new Date(parseInt(times.start)),
                end: new Date(parseInt(times.end)),
                ifBooked: times.ifBooked
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
        return date.getTime() < new Date().getTime();
    };

    verifySelectionsWithInvalidDate = (selections) => {
        let tmpSelections = [];
        let valid = true;
        for (let i = 0; i < selections.length; i++) {
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
            arr.push({
                start: data.start.getTime(),
                end: data.end.getTime(),
                ifBooked: data.ifBooked
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
                <ModifiedAvailableTimes
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