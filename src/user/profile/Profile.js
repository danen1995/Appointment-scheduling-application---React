import React, { Component } from 'react';
import { getCurrentUser } from '../../util/APIUtils';
import { Avatar, Tabs } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

const TabPane = Tabs.TabPane;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile() {
        this.setState({
            isLoading: true
        });

        getCurrentUser()
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });

    }

    componentDidMount() {
        // const username = this.props.match.params.username;
        this.loadUserProfile();
    }

    // componentDidUpdate(nextProps) {
    //     // if (this.props.match.params.username !== nextProps.match.params.username) {
    //     // this.loadUserProfile(nextProps.match.params.username);
    //     this.loadUserProfile();

    //     // }
    // }

    render() {
        let formItems;

        if (this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.user) {
            if (this.state.user.indexNumber) {
                formItems = [
                    <FormItem className="form-item">
                        <Input value={this.state.user.firstName + " " + this.state.user.lastName} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="userName" />
                    </FormItem>,
                    <FormItem className="form-item">
                        <Input value={this.state.user.indexNumber} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="userName" />
                    </FormItem>,
                    <FormItem className="form-item">
                        <Input value={this.state.user.email} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="userName" />
                    </FormItem>
                ];
            }
            if (this.state.user.teacherId) {
                formItems = [
                    <FormItem className="form-item">
                        <Input value={this.state.user.firstName + " " + this.state.user.lastName} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="userName" />
                    </FormItem>,
                    <FormItem className="form-item">
                        <Input value={"cabinet " + this.state.user.cabinet} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="userName" />
                    </FormItem>,
                    <FormItem className="form-item">
                        <Input value={this.state.user.email} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="userName" />
                    </FormItem>
                ]
            }

        }


        if (this.state.notFound) {
            return <NotFound />;
        }

        if (this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="profile">
                {
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle" >
                                        {this.state.user.firstName[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.firstName}</div>
                                    <div className="username">@{this.state.user.lastName}</div>
                                </div>
                            </div>
                            <div className="user-poll-details">
                                <Tabs defaultActiveKey="1"
                                    animated={false}
                                    tabBarStyle={tabBarStyle}
                                    size="large"
                                    className="profile-tabs">
                                    <TabPane tab={`Basic user details`} key="1">
                                        <Form className="login-form">
                                            {formItems}
                                        </Form>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default Profile;