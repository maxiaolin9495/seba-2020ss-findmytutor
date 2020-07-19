"use strict";

import React from 'react';
import UserService from "../../Services/UserService";
import TutorialService from "../../Services/TutorialService";
import EditProfileService from "../../Services/EditProfileService";

import logoIcon from '../../Images/Logo.png';
import { toast } from "react-toastify";
import ChatBox from 'react-chat-plugin';

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
        this.setState({loading: true});
        if (this.props.ready) {
            const socket = this.props.socket;
            if (!socket) {
                toast.error('Error connecting chat server');
                this.props.history.goBack();
            }
            // Read tutor and customer's information
            let tutorialId = this.props.tutorialId;
            TutorialService.getTutorial(tutorialId)
                .then((data) => {
                    let tutorPromise = TutorialService.getTutorByTutorEmail(data.tutorEmail);
                    let customerPromise = EditProfileService.getCustomerByCustomerEmail(data.customerEmail);
                    Promise.all([tutorPromise, customerPromise])
                        .then((values) => {
                            this.setState({
                                tutor: values[0],
                                customer: values[1],
                                tutorial: data,
                                avatarUrl: {
                                    [values[0].email]: values[0].avatar,
                                    [values[1].email]: logoIcon
                                }
                            });
                            socket.emit('join',
                                {
                                    email: UserService.getCurrentUser().email,
                                    name: (UserService.getCurrentUser().userType === 'tutor' ?
                                        `${values[0].firstName} ${values[0].lastName}` :
                                        `${values[1].firstName} ${values[1].lastName}`),
                                    room: tutorialId
                                },
                                (error) => {
                                    if (error) {
                                        toast.error(error);
                                    }

                                });
                        }).catch((e) => {
                        console.error(e);
                    });
                }).catch((e) => {
                console.error(e);
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
                        username: message.user,
                        id: message.id,
                        avatarUrl: this.state.avatarUrl[message.email] || logoIcon,
                    },
                    text: message.text,
                    timestamp: message.timestamp,
                    type: 'text',
                };
                this.setState({
                    messages: [...this.state.messages, newMessage]
                })
            });

            socket.on("roomData", ({users}) => {
                let newNotification = {
                    text: 'Current users: ' + users.map(u => u.name).join(', '),
                    timestamp: +new Date(),
                    type: 'notification',
                };
                this.setState({
                    users,
                    messages: [...this.state.messages, newNotification]
                })
            });

            this.setState({
                socket,
                loading: false,
            });
        }
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
                width={'600px'}
                height={'650px'}
            />
        )
    }
}
