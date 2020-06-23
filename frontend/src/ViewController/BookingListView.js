import React from 'react';
import BookingList from '../UIcomponents/BookingList/BookingList';
import Background from '../Images/Homepage.jpg';
// import SearchService from "../Services/SearchService.js"

export class BookingListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            filteredData: [],
            error: undefined
        };
    }

    componentWillMount() {
        // this.setState({
        //     loading: true
        // });
        // SearchService.getTutorsByKeyword(this.props.location.search.split('=')[1]).then((data) => {
        //     this.setState({
        //         data: [...data],
        //         filteredData: [...data],
        //         loading: false
        //     });
        // }).catch((e) => {
        //     console.error(e);
        // });
    }

    render() {
        // if (this.state.loading) {
        //   return <h2>Loading</h2>
        //}
        return (
            <div>
                <img src={Background} className="bg"/>
                <section>
                    <BookingList />
                        {/* // data={this.state.data}
                        // filteredData={this.state.filteredData}
                        // error={this.state.error}/> */}
                </section>
            </div>
        );
    }
}
