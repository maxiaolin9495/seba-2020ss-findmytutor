"use strict";

import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SearchPageView} from "./ViewController/SearchPageView";
import {LoginView} from "./ViewController/LoginView";
// import {ProjectView} from "./ViewController/ProjectView";
import {RegisterView} from "./ViewController/RegisterView";
import {AboutUsView} from "./ViewController/AboutUsView";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'FindMyTutor',
            routes: [
                {component: SearchPageView, path: '/', exact: true},
                {component: LoginView, path: '/login', exact: true},
                // {component: ProjectView, path: '/projects', exact: true},
                {component: RegisterView, path: '/register', exact: true},
                {component: AboutUsView, path: '/about-us', exact: true}
            ]
        };
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        {this.state.routes.map((route, i) => (<Route key={i} {...route}/>))}
                    </Switch>
                </Router>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
            />
            </div>
        );
    }
}
