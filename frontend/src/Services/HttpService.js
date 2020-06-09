export default class HttpService {
    constructor() {
        this.state = {};
    }

    static get(url, onSuccess, onError) {
        let token = window.localStorage['jwtTokenFMT'];
        let header = new Headers();
        if (token) {
            header.append('x-access-token', `${token}`);
        }

        fetch(url, {
            method: 'GET',
            headers: header
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            else if (this.checkIfUnauthorized(resp)) {
                window.location = "/#login";
            }
            else {
                resp.json().then((json) => {
                    onError(json.error);
                });
            }
        }).then((resp) => {
            if (resp.hasOwnProperty('token')) {
                window.localStorage['jwtTokenFMT'] = resp.token;
            }
            onSuccess(resp);
        }).catch((e) => {
            onError(e.message);
        });
    }

    static put(url, data, onSuccess, onError) {
        let token = window.localStorage['jwtTokenFMT'];
        let header = new Headers();
        if (token) {
            header.append('x-access-token', `${token}`);
        }
        header.append('Content-Type', 'application/json');

        fetch(url, {
            method: 'PUT',
            headers: header,
            body: JSON.stringify(data)
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            /*else if(this.checkIfUnauthorized(resp)) {
                window.location = "/#login";
            }*/
            else {
                resp.json().then((json) => {
                    onError(json.error);
                });
            }
        }).then((resp) => {
            if (resp.hasOwnProperty('token')) {
                window.localStorage['jwtTokenFMT'] = resp.token;
            }
            onSuccess(resp);
        }).catch((e) => {

            onError(e.message);
        });
    }

    static post(url, data, onSuccess, onError) {
        let token = window.localStorage['jwtTokenFMT'];
        let header = new Headers();
        if (token) {
            header.append('x-access-token', `${token}`);
        }
        header.append('Content-Type', 'application/json');

        fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data)
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            /*else if(this.checkIfUnauthorized(resp)) {
                window.location = "/#login";
            }*/
            else {
                resp.json().then((json) => {
                    onError(json.error);
                });
            }
        }).then((resp) => {
            if (resp.hasOwnProperty('token')) {
                window.localStorage['jwtTokenFMT'] = resp.token;
            }
            onSuccess(resp);
        }).catch((e) => {
            onError(e.message);
        });
    }

    static remove(url, onSuccess, onError) {
        let token = window.localStorage['jwtTokenFMT'];
        let header = new Headers();
        if (token) {
            header.append('x-access-token', `${token}`);
        }

        fetch(url, {
            method: 'DELETE',
            headers: header
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            /*else if(this.checkIfUnauthorized(resp)) {
                window.location = "/#login";
            }*/
            else {
                resp.json().then((json) => {
                    onError(json.error);
                });
            }
        }).then((resp) => {
            onSuccess(resp);
        }).catch((e) => {
            onError(e.message);
        });
    }

    static checkIfUnauthorized(res) {
        return res.status === 401;

    }

}
