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

    loadUserProfile(username) {
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
            if (this.state.user.brojIndeksa) {
                formItems = [
                    <FormItem className="stavka-forme">
                        <Input value={this.state.user.ime + " " + this.state.user.prezime} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="korisnickoIme" />
                    </FormItem>,
                    <FormItem className="stavka-forme">
                        <Input value={this.state.user.brojIndeksa} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="korisnickoIme" />
                    </FormItem>,
                    <FormItem className="stavka-forme">
                        <Input value={this.state.user.email} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="korisnickoIme" />
                    </FormItem>
                ];
            }
            if (this.state.user.jmbg) {
                formItems = [
                    <FormItem className="stavka-forme">
                        <Input value={this.state.user.ime + " " + this.state.user.prezime} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="korisnickoIme" />
                    </FormItem>,
                    <FormItem className="stavka-forme">
                        <Input value={ "Kabinet " + this.state.user.kabinet} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="korisnickoIme" />
                    </FormItem>,
                    <FormItem className="stavka-forme">
                        <Input value={this.state.user.email} disabled={true}
                            prefix={<Icon type="user" />}
                            size="large"
                            name="korisnickoIme" />
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
                                        {this.state.user.ime[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.ime}</div>
                                    <div className="username">@{this.state.user.prezime}</div>
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