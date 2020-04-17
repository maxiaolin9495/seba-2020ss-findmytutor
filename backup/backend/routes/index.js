import userlist from '../controllers/UserController';
import booking from '../controllers/BookingController'
const express=require('express')

export default (app) => {


    app.route('/users')
       .get(userlist.getAllUsers)
        .put(userlist.updateUser)

    app.route('/location')
        .get(userlist.getAllUsersByLoc)

    app.route('/location/:location')
        .get(userlist.getUsersByLoc)
    app.route('/email/:email')
        .get(userlist.getUserByEmail)

    app.route('/login')
        .post(userlist.login)
    app.route('/register')
        .post(userlist.register)

    app.route('/users/:userId')
        .get(userlist.getUser)
        .put(userlist.updateUser)
        .delete(userlist.deleteUser)

    app.route('/profile')
        //  .get(userlist.getProfile)
        .post(userlist.uploadProfile)

    app.route('/create')
        .post(booking.createBooking)

    app.route('/getUserBooking/:userEmail')
        .get(booking.getBookingByUserEmail)
    app.route('/:id')
        .delete(booking.removeBooking)

};