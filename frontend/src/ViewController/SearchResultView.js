import React from 'react';
import SearchResultPage from '../UIcomponents/search/SearchResultPage';
import Background from '../Images/searchresultbg.jpg';
import SearchService from "../Services/SearchService.js"

export class SearchResultView extends React.Component {

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
        this.setState({
            loading: true
        });
        console.log(this.props)
        SearchService.getTutorsByKeyword(this.props.location.search.split('=')[1]).then((data) => {
            this.setState({
                data: [...data],
                filteredData: [...data],
                loading: false
            });
        }).catch((e) => {
            console.error(e);
        });
    }

    render() {
        // if (this.state.loading) {
        //   return <h2>Loading</h2>
        //}
        return (
            <div>
                <img src={Background} className="bg"/>
                <section>
                    <SearchResultPage
                        data={this.state.data}
                        filteredData={this.state.filteredData}
                        error={this.state.error}/>
                </section>
            </div>
        );
    }
}
