import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createForm } from 'rc-form';

import {security as action} from '../redux/actions';

import { CertifyButton } from '../commons/components';
import { fetch } from '../redux/actions';

import { InputItem, Button, Checkbox, List, Flex } from 'antd-mobile';
import {Toast} from "antd-mobile/lib/index";
import {APICaller} from "wink_mobile_commons/dist/api/index";
import {api, service, values} from "../commons/configs";

const AgreeItem = Checkbox.AgreeItem;

const localStorage = window.localStorage;

const duration = moment.duration(3, 'minutes');

const mapDispatchToProps = (dispatch) => {
    return {
        authLogin: (params) => {
            return dispatch(action.authLogin(params));
        },
        fail: () => {
            return dispatch(action.loginFail());
        },
        moveHome: () => dispatch(push('/')),
        simpleUpdate: (url, params) => dispatch(fetch.simpleUpdate(url, params))
    }
};

class PhoneNumberLogin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            modal : '',
            fromNow : 0,
            timeOver: false,
            disable: false,
            resetTimer: false,
            modalContent : {
                title : "",
                contents : "",
            }
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onClickSend = this.onClickSend.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    componentDidMount() {
    }

    countDown(fromNow){
        this.setState({
            fromNow,
            disabled : false,
        });
    }

    authLogin(params) {
        this.props.authLogin({...params, actorType: values.actorType.parent})
            .then(({actor}) => {
                if(service.getValue(params, 'autoLogin')) {
                    return APICaller.get(api.getAuthToken(service.getValue(actor, 'authDetail.id', '')).url, {})
                        .then(({data}) => {
                            localStorage.setItem(values.storageKey.AUTH_TOKENNAME, data.authToken);
                        });
                }
            })
            .then(() => {
                this.props.moveHome('/');
            })
            .catch(err => {
                //TODO : 로그인 실패 메시지 출력
                console.log('error message =========== ', err, err.response, err.response.status);
                localStorage.removeItem(values.storageKey.AUTH_TOKENNAME);
                this.props.fail();

                this.props.showModal({title: '로그인 오류', message: service.getValue(err.response, 'data.detail', '로그인 정보를 확인해주세요.')});
            });
    }

    onSubmit(event) {
        event.preventDefault();
        const {timeOver} = this.state;
        if(timeOver) {
             this.props.showModal({title: '인증번호 오류', message: '인증 유효시간을 초과하였습니다. 다시 인증번호 발송 버튼을 눌러주세요.'});
             return ;
        }
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({
                    humanNameError: err.humanName ? true : false,
                    onetimePasswordError: err.onetimePassword ? true : false
                });
                return Toast.fail('필수 입력란을 모두 입력해주세요.', 1);
            }
            this.authLogin(values);
        });
    }

    onClickSend(){
        this.setState({timeOver: false, send: true});
    }

    onTimeOver(){
        this.setState({timeOver: true, send: false});
        this.props.showModal({title: '유효시간 초과', message: '인증 유효시간을 초과하였습니다. 다시 인증번호 발송 버튼을 눌러주세요.'});
    }

    renderTimer(){
        const { fromNow } = this.state;

        const remain = fromNow && (fromNow < duration.asMilliseconds())
            ? duration.asMilliseconds() - fromNow
            : duration.asMilliseconds();

        return (
            <em className="limit-time">{`유효시간 ${moment(remain, 'x').format('mm:ss')}`}</em>
        )
    }

    render() {
        const {form} = this.props;
        const { getFieldProps } = form;
        const {humanNameError, onetimePasswordError, send} = this.state;
        return (
            <div>
                <List className="login-input-list">
                    <InputItem
                        {...getFieldProps('humanMdn')}
                        type="number"
                        maxLength={11}
                        placeholder="휴대폰번호(-생략)"
                    />
                </List>
                <Flex direction="row" className="certify-wrapper">
                    <Flex.Item>
                        <CertifyButton
                            humanMdn={form.getFieldValue('humanMdn')}
                            onClick={this.onClickSend}
                            duration={duration}
                            timeOver={this.onTimeOver.bind(this)}
                            countDown={this.countDown.bind(this)}
                            showModal={this.props.showModal.bind(this)}
                            send={send}
                        />
                    </Flex.Item>
                    <Flex.Item>
                        <List className="login-input-list certify-input">
                            <InputItem
                                {...getFieldProps('onetimePassword', {
                                rules: [{required: true, message: '인증번호를 입력하세요!'}]
                                })}
                                type="digit"
                                maxLength={6}
                                placeholder="인증번호"
                                disabled={!send}
                                error={onetimePasswordError}
                            />
                        </List>
                    </Flex.Item>
                    <Flex.Item>
                        {this.renderTimer()}
                    </Flex.Item>

                </Flex>
                <List className="login-input-list">
                    <InputItem
                        {...getFieldProps('humanName', {
                            rules: [{required: true, message: '이름을 입력하세요!'}]
                        })}
                        placeholder="이름"
                        error={humanNameError}
                    />
                </List>

                <AgreeItem {...getFieldProps('autoLogin', {initialValue: true})} defaultChecked className="login-checkbox">
                    로그인 상태 유지
                </AgreeItem>
                <Button type="primary" onClick={this.onSubmit.bind(this)} disabled={!send} className="login-submit-button" >로그인</Button>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(createForm()(PhoneNumberLogin));
