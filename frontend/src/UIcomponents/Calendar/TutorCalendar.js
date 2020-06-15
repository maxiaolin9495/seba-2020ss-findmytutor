import React from "react";
import {withRouter} from "react-router-dom";
import AvailableTimes from "react-available-times";
import EditProfileService from "../../Services/EditProfileService";


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

            this.setState({initialTimes: tmp}, () => {
                this.setState({timeSlots: this.createTimeSlots()})
            })

        })
    }

    //calendar
    createTimeSlots = () => <AvailableTimes
        weekStartsOn="monday"
        //save selected time slots
        onChange={(selections) => {
            selections.forEach(({start, end}) => {
                console.log('Start:', start, 'End:', end);
            });
            let arr = [];
            selections.forEach((data) => {
                arr.push({
                    start: data.start.getTime(),
                    end: data.end.getTime()
                })
            });
            this.props.sendTimeSlots(arr);
        }}
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