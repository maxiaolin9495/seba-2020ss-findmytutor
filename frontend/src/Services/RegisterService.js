import MD5 from "react-native-md5";
import HttpService from './HttpService';
const config = require ('../config');

export default class RegisterService {

    static baseURL() {
        return config.backendUri + "/user/register";
    }

    static register(email, pass, userType) {
        return new Promise((resolve, reject) => {
            HttpService.post(this.baseURL(),{
                email: email,
                password: MD5.hex_md5(pass),
                userType: userType
            }, function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }
}