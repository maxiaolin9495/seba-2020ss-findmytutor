import mongoose from 'mongoose';
import bookingModel from "../models/BookingModel";
import user from "../models/UserModel";

exports.createBooking= async (req, res) =>{
 const booking = Object.assign(req.body);
    bookingModel.create(booking)
        .then(booking => {
            console.log(booking)
            return res.status(200).json(
                {
                    userEmail: booking.userEmail,
                    selectedEmail: booking.selectedEmail,
                    location: booking.location,
                    time:booking.time,
                    price: booking.price,
                }
            );

        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                error: 'Internal error',
                message: error.message
            })
        });

}
exports.removeBooking = (req, res) => {
    bookingModel.findByIdAndRemove(req.params.id).exec()
        .then(() => res.status(200).json({message: `Booking with id${req.params.id} was deleted`}))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

exports.getBookingByUserEmail = async (req, res) => {
    const {
        userEmail,
    } = req.params;
    const tmp = await bookingModel.find({userEmail: userEmail});
    res.status(200).json(tmp);
};