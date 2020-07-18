import React from 'react';
import SearchResultPage from '../UIcomponents/Search/SearchResultPage';
import Background from '../Images/Searchresultbg.jpg';
import SearchService from "../Services/SearchService.js"
import UserService from "../Services/UserService.js"
import Navigation from "../UIcomponents/PageDesign/Navigation";

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
        UserService.getCurrentUser().userType === 'tutor' && this.props.history.push("/booking");

        this.setState({
            loading: true
        });
        console.log(this.props);
        SearchService.getTutorsByKeyword(this.props.location.search.split('=')[1])
            .then((data) => {
                let sortedTutor = data.sort(this.sortByRating)
                this.setState({
                    data: sortedTutor,
                    filteredData: [...data],
                    loading: false
                });
            }).catch((e) => {
            console.error(e);
        });

    }

    sortByRating=(a, b)=> {
        let ratingA = a.rating || 0;
        let ratingB = b.rating || 0; 
        let comparison = 0;
        if (ratingA > ratingB) {
          comparison = -1;
        } else if (ratingA < ratingB) {
          comparison = 1;
        }
        return comparison;
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
        filteredTutor.sort(this.sortByRating);
        this.setState({
            filteredData: filteredTutor,
            loading: false
        });
    };

    render() {
        // if (this.state.loading) {
        //   return <h2>Loading</h2>
        //}
        return (
            <div>
                <Navigation/>
                <img src={Background} className="bg" alt={'Background'}/>
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
