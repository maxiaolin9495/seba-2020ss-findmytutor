import mongoose, {
    Schema
} from 'mongoose';

/**
 * Create database scheme for notes
 */
const BookingScheme = new Schema({

    userEmail:{
        type: String,
        required: true
    },
    selectedEmail:{
        type: String,
        required: true
    },
    location:{
        type: String
    },
    time:{
        type: String
    },
    price:{
        type:String,
        required:true
    }
});

export default mongoose.model('booking', BookingScheme);
