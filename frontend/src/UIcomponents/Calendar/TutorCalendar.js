import React from "react";
import {withRouter} from "react-router-dom";
import AvailableTimes from "react-available-times";
import EditProfileService from "../../Services/EditProfileService";
import {toast} from "react-toastify";


class TutorCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialTimes: [],
            timeSlots: <div/>
        };
    }

//upload initial selected time slots
    componentWillMount() {
        let tmp = [];
        EditProfileService.getTutorProfile().then((data) => {
            console.log(data)
            data.timeSlotIds.forEach((times) => {
                tmp.push({
                    start: new Date(parseInt(times.start)),
                    end: new Date(parseInt(times.end))
                })
            })
            let result = this.verifySelectionsWithInvalidDate(tmp);
            this.setState({initialTimes: result.selections}, () => {
                this.setState({timeSlots: this.createTimeSlots()})
            })

        })
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
            arr.push({
                start: data.start.getTime(),
                end: data.end.getTime()
            })
        });
        this.setState({initialTimes: selections}, () => {
            this.setState({timeSlots: <div/>}, () => {
                this.setState({timeSlots: this.createTimeSlots()})
            })
        })
        this.props.sendTimeSlots(arr);

    }


    //calendar
    createTimeSlots = () => <AvailableTimes
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
        availableHourRange={{start: 6, end: 24}}
    />;


    render() {
        return (
            <div>
                {this.state.timeSlots}
            </div>

        );
    }

}

export default withRouter(TutorCalendar);