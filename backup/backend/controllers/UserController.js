import mongoose from 'mongoose';
import user from '../models/UserModel.js';

const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');


exports.getTest = (req, res) => {
    res.render('index.ejs', {name: 'Qiyu'})
}


exports.getUser = (req, res) => {
    user.findById(req.params.userId, (err, user) => {
        if (err) {
            res.send(err);
        }
        if (user) {
            res.json(user);
        } else {
            res.send('User does not exist')
        }

    });

};

exports.getAllUsers = (req, res) => {
    user.find({}, (err, users) => {
        if (err) {
            res.send(err);
        }
        res.json(users);

    });
};

exports.getAllUsersByLoc = (req, res) => {
    user.find({location:req.params.location}, (err, users) => {
        if (err) {
            res.send(err);
        }
        if(users) {
            console.log(users)
            res.json(users);
        } else {
            res.send('No user registered in this place')
        }
    });

};
exports.getUserByEmail = async (req, res) => {
    const {
        email,
    } = req.params;
    const tmp = await user.findOne({email: email});
    res.status(200).json(tmp);
};

exports.getUsersByLoc = async (req, res) => {
    const {
        location,
    } = req.params;
    const users = await user.find({location: location});
    res.status(200).json(users);
};
exports.register = (req, res) => {
    const newemail = req.body.email
    user.findOne({
        email: newemail
    })
        .then(tmp => {
                console.log(tmp);
                if (tmp) {
                    return res.json({error: 'User already exists'});

                } else {
                    console.log('continue')
                    //encrypt the password
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        let newUser = new user(req.body);
                        newUser.password = hash
                        newUser.save((err, user) => {
                            if (err) {
                                res.send(err);
                            }
                            console.log(user);
                            //create a token
                            const token = jwt.sign({
                                    email: req.body.email
                                }
                                , config.JwtSecret, {
                                    expiresIn: 86400 // expires in 24 hours
                                });
                            res.status(200).json({token: token});
                            //  res.json(user);
                        });
                    })

                }

            }
        ).catch(err => {
        res.send('error' + err)
    })


};

exports.login = (req, res) => {

    user.findOne({
        email: req.body.email
    })
        .then(tmp => {
                console.log(tmp);
                if (tmp) {
                    //password match
                    if (bcrypt.compareSync(req.body.password, tmp.password)) {
                        console.log('login successful')
                        console.log(tmp.email)
                        //create a token
                        const token = jwt.sign(
                            {
                                email: tmp.email,
                                firstName: tmp.firstName,
                                lastName: tmp.lastName,
                                birthDate: tmp.birthDate,
                                location: tmp.location,
                                recommend: tmp.recommend,
                                price:tmp.price
                            }, config.JwtSecret, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                        console.log('login')
                        console.log(tmp)
                        return res.status(200).json({token: token})
                    } else {
                        // res.status(404);
                        return res.json({error: 'Password is incorrect, please try again'}).send({token: null})
                    }

                } else {
                    return res.json({error: 'Please register first'});

                }

            }
        ).catch(err => {
        res.send('error' + err)
    })


};
exports.uploadProfile = (req, res) => {
    const profile = Object.assign({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        location: req.body.location,
        birthDate: req.body.birthDate,
        recommend: req.body.recommend,
        price:req.body.price

    })
    user.updateOne({email: profile.email}, profile)
        .then(profile => {
        const token = jwt.sign({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            location: req.body.location,
            birthDate: req.body.birthDate,
            recommend: req.body.recommend,
            price:req.body.price
        }, config.JwtSecret, {
            expiresIn: 999999 // time in seconds until it expires
        });
        console.log('uploadPro')
        console.log(req.body.birthDate)
        return res.status(200).json({token: token});
    })
        //   return res.json(profile);
        .catch(error => {
            console.log('error by creating a User Profile');
            if (error.code == 11000) {
                return res.status(400).json({
                    error: 'Profile exists',
                    message: error.message
                })
            } else {
                return res.status(500).json({
                    error: 'Internal server error happens',
                    message: error.message
                })
            }
        });
}

exports.getProfile = (req, res) => {
    user.findOne({email: req.body.email})
        .then(tmp => {
            return res.status(200).json({
                email: tmp.email,
                firstName: tmp.firstName,
                lastName: tmp.lastName,
                location: tmp.location,
                birthDate: tmp.birthDate,
                recommend: tmp.recommend,
                price:tmp.price

            })
        }).catch(error => {
            console.log('error by searching user')
            return res.status(404).json({
                error: 'User Not Found',
                message: error.message
            })
        }
    )

}
//update user with email address
exports.updateUserPassword = (req, res) => {
    console.log(user)
    mongoose.set('useFindAndModify', false);
    user.findOneAndUpdate({
            email: req.params.email
        }, req.body,
        (err, user) => {
            if (err) {
                res.send(err);
            }
            console.log(user)
            res.json(user);
        });
};
//update user with userId
exports.updateUser = (req, res) => {
    user.findOneAndUpdate({
            _id: req.params.userId
        }, req.body,
        (err, user) => {
            if (err) {
                res.send(err);
            }

            res.json(user);
        });
};
exports.deleteUser = (req, res) => {
    user.remove({
        _id: req.params.userId
    }, (err) => {
        if (err) {
            res.send(err);
        }

        res.json({
            message: `user ${req.params.userId} successfully deleted`
        });
    });
};

const logout = (req, res) => {
    res.status(200).send({token: null});
}