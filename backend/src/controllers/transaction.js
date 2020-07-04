const transactionModel = require('../models/transaction');
const customerModel = require('../models/customer');
const tutorModel = require('../models/tutor');
const getTransaction = (req, res) => {
    const {
        payer,
    } = req.params;

    if (!payer) {

        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request uri must contain a payer parameter'
        });

    }
    transactionModel.find({payer: payer})
        .exec()
        .then(transactions => {
            return res.status(200).json({
                transactions
            })
        }).catch(error => {
        return res.status(404).json({
            error: 'Tutor not found',
            message: error.message
        })
    })
};
const createTransaction = (req, res) => {

    customerModel.findOne({email: req.body.payer}).exec()//customerModel schema
        .then(user => {
            if (user) {
                tutorModel.findOne({
                    email: req.body.receiver
                })
                    .exec()//customerModel schema
                    .then(tutor => {
                        if (tutor) {
                            const transaction = Object.assign({
                                payer: req.body.payer,
                                receiver: req.body.receiver,
                                transactionStatus: req.body.transactionStatus,
                                transactionIds: req.body.transactionIds
                            });
                            transactionModel.create(transaction)
                                .then(transaction => {
                                    return res.status(200).json({
                                        transactionId:transaction._id
                                    })
                                }).catch(error => {
                                console.log('error by creating a transaction');
                                return res.status(500).json({
                                    error: 'Internal server error happens by add transaction',
                                    message: error.message
                                })

                            });
                        } else {
                            return res.status(400).json({
                                error: 'Bad Request',
                                message: 'The receiver does not exist.'
                            })
                        }
                    });
            } else {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'The payer does not exist.'
                });
            }
        })
        .catch(error => {
            console.log('error by creating transaction ' + error.message);
        });


};



module.exports = {
    getTransaction,
    createTransaction

};