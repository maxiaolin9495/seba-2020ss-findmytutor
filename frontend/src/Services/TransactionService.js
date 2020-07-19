"use strict";

import HttpService from './HttpService';
const config = require('../config');

export default class TransactionService {
    static baseURL = () => config.backendUri;

    static createTransaction(transaction) {
        console.log(transaction);
        return new Promise((resolve, reject) => {

            HttpService.post(this.baseURL() + '/transaction/createTransaction',
                {
                    payer: transaction.payer,
                    receiver: transaction.receiver,
                    transactionStatus: transaction.transactionStatus,
                    transactionId: transaction.transactionId
                }, function (data) {
                    resolve(data);
                }, function (textStatus) {
                    reject(textStatus);
                });

        })
    }

    static getTransactions(payer) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/transaction/getTransaction/${payer}`,
                function (data) {
                    console.log('transaction');
                    console.log(data);

                    if (data !== undefined || Object.keys(data).length !== 0) {
                        resolve(data);
                    } else {
                        reject('Error while retrieving tutorials');
                    }
                }, function (textStatus) {
                    reject(textStatus);
                });
        });
    }

}