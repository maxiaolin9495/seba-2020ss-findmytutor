import React, { Component } from 'react';
import { Button } from 'react-md';
import { withRouter } from "react-router-dom";
import SearchResultCard from "./SearchResultCard";
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import '@progress/kendo-theme-default/dist/all.css';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


class SearchResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            value: [],
            price: [0,100],
            universities: []
        }
    }

    onChange = (event) => {
        this.setState({
            value: [...event.target.value]
        });
    };

    valuetext(value) {
        return `${value}`;
    }
    



    componentWillReceiveProps(props) {
        this.setState({
            cards: props.filteredData.map(d => {
                return (<SearchResultCard
                    key={d.id}
                    tutor={d}/>)
            })
        });
        let altUniversities = props.data.map(function (uni) {
            return uni.university
        });
        this.setState({
            universities: altUniversities.filter(
                function (item, pos) {
                    return altUniversities.indexOf(item) === pos;
                })
        })
    }

    handleFilter=()=> {
        let filterUni;
        if (this.state.value.length !== 0){
            filterUni = this.state.value
        } else {
            filterUni = this.state.universities;}
        this.props.onFilter(filterUni, this.state.price);
    }

    handleReset=()=> {
        this.props.onFilter(this.state.universities,[0,100]);
        this.setState({
            value: [],
            price: [0,100]
        });
    }

    renderCards = () => {
        this.props.data.map(d => {
            return (<SearchResultCard
                key={d.id}
                tutor={d} />
            )
        });
    };

    handleChange = (event, newValue) => {
        this.setState({price: newValue});
        console.log(this.state.price)
    };

    render() {

        return (
            <div style={{ marginBottom: "40px" }}>
                <div className="md-block-centered" style={{
                    flexDirection: 'row',
                    width: '70%',
                    height: '200px',
                    background: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 1.0)',
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
                        <div className="slider">
                            <Typography id="range-slider" gutterBottom>
                                Price range </Typography>
                            <Slider
                                value={this.state.price}
                                onChange={this.handleChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                getAriaValueText={this.valuetext}
                            />
                        </div>
                        <div style={{flexDirection: 'row',}}>
                        <Button style={{
                            background: '#2196F3',
                            borderRadius: '10px',
                            color: 'white',
                            marginTop: '15px',
                            marginLeft: '550px',
                            fontSize: '15px',
                            fontFamily: 'San Francisco'
                        }}
                                onClick={() => this.handleFilter()}>Filter</Button>
                        <Button style={{
                            background: 'gray',
                            borderRadius: '10px',
                            color: 'white',
                            marginTop: '15px',
                            marginLeft: '15px',
                            fontSize: '15px',
                            fontFamily: 'San Francisco'
                        }}
                                onClick={() => this.handleReset()}>Reset</Button>
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

