import React from 'react';
import { connect } from 'react-redux';
import {push} from 'react-router-redux';

import {values} from '../../commons/configs';
import { fetch, security as action } from '../../redux/actions';

import { Flex, Button, List, Card, Switch, Modal } from 'antd-mobile';
import {SecurityService, SessionService} from 'wink_mobile_commons/dist/security/services';

const Item = List.Item;

const mapStateToProps = ({ fetch, security }) => {
    return {
        parent: {...security, push: true}
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        multipleList: (list) => dispatch(fetch.multipleList(list)),
        list: (url, params) => dispatch(fetch.list(url, params)),
        logout: () => {
            return dispatch(action.logout());
        },
        move: (location) => dispatch(push(location)),
    }
};

class Settings extends React.Component {
    state = {

    };
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        // const {parent} = this.props;
        // const obj =  api.getFamily(parent.actorId);
        // return APICaller.get(obj.url, obj.params)
        //     .then(({data}) => {
        //         if(data.count === 0 ) {
        //             return ;
        //         }
        //         const obj = api.getMembers(data.results[0].id);
        //         return this.props.multipleList([{id:'familyMembers', url :obj.url, params : obj.params }]);
        //     });
    }

    confirmLogout() {
        Modal.alert('로그아웃', '학부모앱 서비스에서 로그아웃 하시겠습니까?', [
            { text: '취소', onPress: () => {return false;}, style: 'default'},
            { text: '확인', onPress: () => this.logout()}
        ]);
    }

    logout() {
        // e.preventDefault();
        // const confirm = this.confirmLogout();
        // console.log(confirm);
        // if(!confirm) {
        //     return ;
        // }
        localStorage.removeItem(values.storageKey.AUTH_TOKENNAME);
        SessionService.logout();
        SecurityService.logout()
            .then(() => {
                this.props.logout();
                this.props.move('/login');
            });
    }

    renderLoginSetting() {
        const {parent} = this.props;
        return (
            <Card full className="setting-item">
                <Card.Header
                    title="로그인"
                />
                <List>
                    <Item
                        extra={
                            <Button type="primary" size="small" onClick={e => this.confirmLogout(e)}>로그아웃</Button>
                        }
                        >
                        {parent.humanName}
                    </Item>
                </List>
            </Card>
        )
    }

    onPushChange(push) {
        console.log('onPushChange: ', push);
    }

    renderPushSetting() {
        const {parent} = this.props;
        return (
            <Card full className="setting-item">
                <Card.Header
                    title="알림 설정"
                    extra={
                        <Switch
                            checked={parent.push}
                            onChange={checked => this.onPushChange(checked)}
                            platform="ios"
                        />
                    }
                />
                <List>
                    <Item>
                        윙크 영상통화앱에서 PUSH 알람을 받습니다.
                    </Item>
                </List>
            </Card>
        )
    }

    renderVersionInfo() {
        return (
            <Card full className="setting-item">
                <Card.Header
                    title="버전정보"
                />
                <List>
                    <Item>
                        현재 버전       Ver.1.0.1
                    </Item>
                    <Item>
                        최신 버전       Ver.2.0.0
                    </Item>
                </List>
            </Card>
        )
    }


    render() {
        return (
            <div>
                <Flex direction="column" className="setting-list-wrapper">
                    <Flex.Item>
                        {this.renderLoginSetting()}
                    </Flex.Item>
                    <Flex.Item>
                        {this.renderPushSetting()}
                    </Flex.Item>
                    <Flex.Item>
                        {this.renderVersionInfo()}
                    </Flex.Item>
                </Flex>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
