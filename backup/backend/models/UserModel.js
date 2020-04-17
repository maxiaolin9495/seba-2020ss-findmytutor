import mongoose, {
    Schema
} from 'mongoose';

/**
 * Create database scheme for notes
 */
const NoteScheme = new Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    email:{
        type: String,
        required: "Please enter the email"
    },
    password:{
        type: String,
        required: "Please enter the password"
    },
    location:{
        type: String
    },
    birthDate:{
        type: String
    },
     recommend:{
        type: String
     },
    date: {
        type: Date,
        default: new Date
    },
    price:{
        type:String
    }
});

export default mongoose.model('User', NoteScheme);
