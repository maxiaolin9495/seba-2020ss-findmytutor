import React, { PureComponent } from 'react';
import { DialogContainer, Button } from 'react-md';

export default class Dialog extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            title: true,
            footer: true,
            height: null,
            width: null,
            visible: !!props.visible,
            actions: [{
                label: 'Ok',
                primary: true,
                onClick: this.ok,
            }, {
                label: 'Cancel',
                secondary: true,
                onClick: this.hide,
            }]
        };
    }

    show = () => {
        this.setState({ visible: true });
    };

    ok = () => {
        this.props.onClick();
    };
    hide = () => {
        this.setState({ visible: false });
    };

    render() {
        return (
            <div
                className="md-full-width"
                style={{ marginTop: 0 }}>
                {this.props.actionName === 'confirm' ?
                    <Button
                        className="md-full-width"
                        raised
                        primary
                        style={{
                            borderRadius: '10px',
                            marginTop: '5px',
                            color: 'white',
                            fontSize: '18px',
                            fontFamily: 'San Francisco'
                        }}
                        onClick={this.show}>{this.props.actionName}</Button>
                    :
                    <Button
                        raised
                        className="md-full-width"
                        style={{
                            background: 'red',
                            borderRadius: '10px',
                            marginTop: '32px',
                            color: 'white',
                            fontSize: '18px',
                            fontFamily: 'San Francisco'
                        }}
                        onClick={this.show}>{this.props.actionName}</Button>
                }
                <DialogContainer
                    id="scrolling-content-dialog"
                    title='Confirm your operation'
                    visible={this.state.visible}
                    onHide={this.hide}
                    actions={this.state.actions}
                >
                    <p>
                        Do you really want to {this.props.actionName} this booking?
                    </p>
                </DialogContainer>
            </div>
        )
    }
}