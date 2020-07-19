import React from 'react';
import { Autocomplete, Button } from 'react-md';
import SearchService from "../../Services/SearchService";
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify';
class SearchBarComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterType: Autocomplete.fuzzyFilter,
            data: [],
            searchValue: ""
        }
    }
    componentDidMount() {
        SearchService.getAllTutorsAndCourses()
            .then((data) => {
                this.setState({
                    data: [...data]
                });
            }).catch((e) => {
            console.error(e);
        });
    }

    searchBySearchBar =() =>{
        if(this.state.searchValue === '') {
            toast.error('Please input a tutor or course name');
            return;
        }
        this.props.history.push(`/searchResult?query=${this.state.searchValue}`)
    };
    render() {

        return (
            <div className="md-grid md-block-centered" style={{background:'white', opacity:'90%'}}>
                <Autocomplete style={{width:'300px'}}
                    id="search-bar"
                    label="Search Tutor or Course Name"
                    placeholder="SEBA"
                    data={this.state.data}
                    onAutocomplete={(value) => this.setState({searchValue: value})}
                    onChange={(value) => this.setState({searchValue: value})}
                    filter={this.state.filterType}
                />
                <Button raised primary  style={{
                            height: '53.63px',
                            fontSize: '15px',
                            color: 'white',
                            marginTop: '8px'
                        }} onClick={() => this.searchBySearchBar()}
                        >Search</Button>
            </div>
        );
    }
}
export default withRouter(SearchBarComponent);