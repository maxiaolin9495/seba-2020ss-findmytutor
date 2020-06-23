import HttpService from './HttpService';
const config = require('../config');

export default class ReviewService {
    constructor() {
    }
    static baseURL = () => config.backendUri ;

    
    static createReview(review) {
        return new Promise((resolve, reject) => {
            HttpService.post(this.baseURL() + '/customer/createReview',
                {time: new Date().toLocaleDateString(),
                    tutorEmail: review.tutorEmail,
                    customerEmail: review.customerEmail,
                    comprehensionRating: review.comprehensionRating,
                    friendlinessRating: review.friendlinessRating,
                    teachingStyleRating: review.teachingStyleRating,
                    overallRating: review.overallRating,
                    text: review.text
                }, function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });

        })
    }
    
}