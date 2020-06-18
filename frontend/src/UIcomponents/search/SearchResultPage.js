import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import SearchResultCard from "./SearchResultCard";
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import '@progress/kendo-theme-default/dist/all.css';

// export const history = createHashHistory();

// const universities = {
//     university: [],
// }

// const prices = {
//     Price: []
// }

class SearchResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            value:[],
            universities: []
        }
    }
    onChange = (event) => {
        this.setState({
            value: [ ...event.target.value ]
        });
    }



    componentWillReceiveProps(props) {
        this.setState({
            cards: props.filteredData.map(d => {
                console.log(d);
                return (<SearchResultCard
                    key={d.id}
                    tutor={d} />)
            })
        })
        let altUniversities = props.filteredData.map(function(uni) {
            return uni.university
          })
        this.setState({
            universities: altUniversities.filter(function(item, pos) {
                return altUniversities.indexOf(item) == pos;
            })
        })
    }
    renderCards = () => {
        this.props.data.map(d => {
            return (<SearchResultCard
                key={d.id}
                tutor={d} />
            )
        });
    };

    render() {

        return (
            <div style={{ marginBottom: "40px" }}>
                <div className="md-block-centered" style={{
                    flexDirection: 'row',
                    width: '70%',
                    height: '300px',
                    background: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '20px',
                    paddingBottom: '20px'
                }}>
                     <div className="example-wrapper">
                <div>
                    <div>University:</div>
                    <MultiSelect
                        data={this.state.universities}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </div>
            </div>
                </div>
                
                <div style={{
                    position: 'relative',
                }}>
                    {this.state.cards}
                </div>
            </div>
        );
    }
}

export default withRouter(SearchResultPage);

