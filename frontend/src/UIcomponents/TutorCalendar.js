import React from "react";
import {withRouter} from "react-router-dom";
import AvailableTimes from "react-available-times";
import {Button} from "react-md";
import {toast} from "react-toastify";
//import ProfileService from "../services/ProfileService";

class TutorCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule: [],
            initialTimes: [],
            timeSlots:<div/>
        };
    }

//upload initial selected time slots
    componentWillMount() {
       let tmp = [];
     /*   ProfileService.getCurrentUser().timeSlots.forEach((data) => {
            tmp.push({
                start: new Date(parseInt(data.start)),
                end: new Date(parseInt(data.end))
            });
        });*/
        this.setState({initialTimes:tmp},()=>{
            this.setState({timeSlots:this.createTimeSlots()})
        })
    }
    //calendar
    createTimeSlots=()=><AvailableTimes
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
            this.setState({schedule: arr})
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
    handleChangeSave = () => {
        toast.success('Schedule successfully saved!');
      //  this.props.parentCallback(this.state.schedule);
    };


    render() {
        return (
            <div>
                {this.state.timeSlots}
                <Button id="save"
                        raised primary swapTheming
                        onClick={this.handleChangeSave}
                >Save</Button>
            </div>

        );
    }

}

export default withRouter(TutorCalendar);