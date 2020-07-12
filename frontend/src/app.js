"use strict";

import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchPageView } from "./ViewController/SearchPageView";
import { SearchResultView } from "./ViewController/SearchResultView";
import { LoginView } from "./ViewController/LoginView";
import { RegisterView } from "./ViewController/RegisterView";
import { AboutUsView } from "./ViewController/AboutUsView";
import { ContactUsView } from "./ViewController/ContactUsView";
import { EditProfileView } from "./ViewController/EditProfileView";
import { TutorPageView } from "./ViewController/TutorPageView";
import { BookingListView } from "./ViewController/BookingListView";
import {ReviewTutorView} from "./ViewController/ReviewTutorView";
import {VideoCallView} from "./ViewController/VideoCallView";
import { ChatBar } from "./UIcomponents/ChatBar/ChatBar";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'FindMyTutor',
            routes: [
                { component: SearchPageView, path: '/', exact: true },
                { component: SearchResultView, path: '/searchResult', exact: true },
                { component: LoginView, path: '/login', exact: true },
                { component: RegisterView, path: '/register', exact: true },
                { component: AboutUsView, path: '/about-us', exact: true },
                { component: ContactUsView, path: '/contact-us', exact: true },
                { component: EditProfileView, path: '/me', exact: true },
                { component: TutorPageView, path: '/tutor/:id' },
                { component: BookingListView, path: '/booking', exact: true },
                { component: ReviewTutorView, path: '/review/:id', exact: true },
                { component: ChatBar, path: '/chat/:id', exact: true },
                { component: VideoCallView, path: '/video/:id',exact: true }
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
                        {this.state.routes.map((route, i) => (<Route key={i} {...route} />))}
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
