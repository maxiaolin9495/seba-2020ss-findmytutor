"use strict";

import React from 'react';
import UserService from "../../Services/UserService";
import TutorialService from "../../Services/TutorialService";
import EditProfileService from "../../Services/EditProfileService";


import Background from '../../Images/Homepage.jpg';
import logoIcon from '../../Images/Logo.png';
import Navigation from "../PageDesign/Navigation";
import { toast } from "react-toastify";
import io from "socket.io-client";
import ChatBox, { ChatFrame } from 'react-chat-plugin';

const config = require('../../config');

export class ChatBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            email: UserService.getCurrentUser().email,
            messages: [],
            message: '',
            avatarUrl: {}
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        const socket = io(`${config.backendUri}/chat`);
        if (!socket) {
            toast.error('Error connecting chat server');
            this.props.history.goBack();
        }
        // Read tutor and customer's information
        let tutorialId = this.props.match.params.id;
        TutorialService.getTutorial(tutorialId).then((data) => {
            TutorialService.getTutorByTutorEmail(data.tutorEmail).then((tutor) => {
                console.log("get tutor infos");
                this.setState({
                    tutor: tutor,
                    tutorial: data,
                    avatarUrl: {
                        ...this.state.avatarUrl,
                        [tutor.email]: tutor.avatar
                    }
                });
            });
            EditProfileService.getCustomerByCustomerEmail(data.customerEmail).then((customer) => {
                this.setState({
                    customer,
                    avatarUrl: {
                        ...this.state.avatarUrl,
                        [customer.email]: logoIcon
                    }
                })
            });
        }).catch((e) => {
            console.error(e);
        });

        socket.emit('join',
            {
                name: UserService.getCurrentUser().email,
                room: tutorialId
            },
            (error) => {
                if (error) {
                    toast.error(error);
                }

            });

        // receive notification
        socket.on('notification', notification => {
            let newNotification = {
                text: notification.text,
                timestamp: notification.timestamp,
                type: 'notification',
            };
            this.setState({
                messages: [...this.state.messages, newNotification]
            })
        });

        // receive message
        socket.on('message', message => {
            let newMessage = {
                author: {
                    username: (message.user === this.state.tutor.email ?
                        `${this.state.tutor.firstName} ${this.state.tutor.lastName}` :
                        `${this.state.customer.firstName} ${this.state.customer.lastName}`),
                    id: message.id,
                    avatarUrl: this.state.avatarUrl[message.user] || logoIcon,
                },
                text: message.text,
                timestamp: message.timestamp,
                type: 'text',
            };
            this.setState({
                messages: [...this.state.messages, newMessage]
            })
        });

        socket.on("roomData", ({ users }) => {
            this.setState({
                users
            })
        });

        this.setState({
            socket,
            loading: false,
        });
    }

    handleOnSendMessage = (message) => {
        // message info
        this.state.socket.emit('sendMessage',
            {
                text: message,
                timestamp: +new Date(),
            },
            () => true);
    };

    componentWillUnmount() {
        this.state.socket.emit('disconnect');
        this.state.socket.off();
    }

    render() {
        if (this.state.loading) {
            return (<h2>Loading...</h2>);
        }

        return (
            <ChatBox
                messages={this.state.messages}
                userId={this.state.socket.id}
                onSendMessage={this.handleOnSendMessage}
                width={'500px'}
                height={'500px'}
            />
        )
    }
}
