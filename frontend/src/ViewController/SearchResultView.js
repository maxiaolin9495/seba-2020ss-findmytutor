import React from 'react';
import SearchResultPage from '../UIcomponents/search/SearchResultPage';
import Background from '../Images/searchresultbg.jpg';
import SearchService from "../Services/SearchService.js"
import Navigation from "../UIcomponents/pageDesign/Navigation";

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
        console.log(this.props);
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

    filterTutor =(universities, price) => {
        let filteredTutor = [];
        this.state.data.map(d => {
            if (universities !== [] &&
                price !== [] && 
                universities.includes(d.university) &&
                d.price>=price[0] && d.price<=price[1]) {
                    filteredTutor.push(d)
                
            }
        });
        this.setState({
            filteredData: filteredTutor,
            loading: false
        });
    }

    render() {
        // if (this.state.loading) {
        //   return <h2>Loading</h2>
        //}
        return (
            <div>
                <Navigation/>
                <img src={Background} className="bg"/>
                <section>
                    <SearchResultPage
                        data={this.state.data}
                        filteredData={this.state.filteredData}
                        onFilter={(universities, price) => this.filterTutor(universities, price)}
                        error={this.state.error}/>
                </section>
            </div>
        );
    }
}
