import React, { Component } from 'react';
import { Button} from 'react-md';
import { Avatar } from "antd";
import { withRouter } from 'react-router-dom'
import StarRatingComponent from 'react-star-rating-component';


class SearchResultCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className="md-block-centered" style={{
                marginTop: '20px',

                boxShadow: '10px 10px 20px gray',
                width: '70%',
                display: 'flex',
                paddingTop: '1%',
                paddingBottom: '1%',
                paddingLeft: '1%',
                background: 'white',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                <h1 className="md-full-width" style={{
                    color: 'black',
                    fontWeight: 'bolder',
                    fontFamily: 'Lucida Bright'
                }}>{this.props.tutor.firstName} {this.props.tutor.lastName}</h1>
                <div className="md-grid md-full-width">
                    <div className="md-cell md-cell--5">

                        <h3 style={{
                            color: 'gray',
                            fontWeight: 'bolder',
                            fontFamily: 'cursive'
                        }}>UNIVERSITY</h3>
                        <h2 style={{
                            marginTop: '0px',
                            color: 'black'
                        }}
                        >{this.props.tutor.university}</h2>
                        <h3 style={{
                            color: 'gray',
                            fontWeight: 'bolder',
                            fontFamily: 'cursive'
                        }}>HOURLY PRICE</h3>
                        <h2 style={{
                            color: 'black',
                        }}>EUR {this.props.tutor.price} </h2>
                        <h3 style={{
                            color: 'gray',
                            fontWeight: 'bolder',
                            fontFamily: 'cursive'
                        }}>DESCRIPTION</h3>
                        <h2 style={{ color: 'black',
                            fontWeight: 'bolder',
                            fontFamily: 'cursive' }}>{this.props.tutor.description.slice(0, 200) + '...'}
                        </h2>
                    </div>

                    <div className="md-cell md-cell--4">
                        <h3 style={{
                            color: 'gray',
                            fontWeight: 'bolder',
                            fontFamily: 'cursive'
                        }}>TEACHES</h3>
                        <h2 style={{
                            fontWeight: 'bolder',
                            fontFamily: 'cursive',
                            width: '70%',
                            marginLeft: '1.1%'
                        }}>{this.props.tutor.courses.map(course => { return (<h3 style={{
                            fontWeight: 'bolder',
                            fontFamily: 'cursive'
                        }}>{course}</h3>) })}</h2>
                    </div>
                    <div className="md-cell md-cell--3">
                        <div>
                        <Avatar 
                            src={this.props.tutor.avatar}
                        />
                        </div>
                        <div style={{marginLeft:'50px'}}>
                        <StarRatingComponent
                            name="rate2"
                            editing={false}
                            starCount={5}
                            value={this.props.tutor.rating} /></div>
                        <h3 style={{ fontWeight: 'bolder',fontFamily: 'cursive' ,marginLeft:'50px'}}>{this.props.tutor.reviewIds ?
                            this.props.tutor.reviewIds.length :
                            0
                        } review(s)</h3>
                        <Button primary style={{
                            background: '#2196F3',
                            borderRadius: '10px',
                            color: 'white',
                            marginTop: '15px',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            marginRight: '50px',
                            marginLeft:'50px',
                            fontSize: '22px',
                            fontFamily: 'San Francisco'
                        }} onClick={() => {
                            this.props.history.push(`/tutor/${this.props.tutor._id}?query=${this.props.location.search.split('=')[1]}`);
                            setTimeout(() => window.scrollTo(0, 0), 150);
                        }}>Book</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchResultCard);
