
import React from 'react';

import { StickyContainer } from 'react-sticky';
import { APICaller } from './mobileCommons/api';

import {api, service, values} from './commons/configs';
import { WrapperContainer } from './layout';

import Push from './lib/Push';
import {PLATFORM, getPlatformName} from './lib/utils';
import {requestPermissions} from './lib/permissions';
import { connect } from 'react-redux';

import {socket as socketAction} from './redux/actions';

const mapStateToProps = ({ security }) => ({
    parent : security
});

const mapDispatchProps = dispatch => ({
    connect: () => {
        return dispatch(socketAction.connect());
    },
    worker: (worker) => {
        return dispatch(socketAction.initWorker(worker));
    }
});

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menu : false,
            mypage : false,
        };
        this.platform = getPlatformName();
        this.onOpenChange = this.onOpenChange.bind(this);
    }

    componentDidMount() {
        if (this.platform !== PLATFORM.browser) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        }

    }

    modifyActor() {
        const pushIdsIos = JSON.parse(window.localStorage.getItem(values.storageKey.PUSH_IDS_IOS));
        if(pushIdsIos) {
            const {parent} = this.props;
            const params = {
                data: {
                    pushIdsIos
                }
            };
            const obj = api.modifyActor(service.getValue(parent, 'actor.id'), params);
            return APICaller.post(obj.url, obj.params);
        }
    }

    onDeviceReady() {
        console.log('onDeviceReady: ', window.plugins.OneSignal);
        if(window.plugins && window.plugins.OneSignal && window.cordova.platformId === 'ios') {
            Push.init(
                (pushIds) => {
                    this.onPushIds(pushIds);
                },
                (notifyData) => {
                    this.onPushNotify(notifyData);
                }
            );
        }
        navigator.getUserMedia  = navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
        requestPermissions();
    }

    // 푸시 아이디를 스토리지에 저장한다. (나중에 이용자가 로그인 할 때, 이것을 읽어서 actor 정보에 저장하도록 한다.)
    onPushIds = (ids) => {
        localStorage.setItem(values.storageKey.PUSH_IDS_IOS, JSON.stringify({...ids, registDate: new Date()}));
        this.modifyActor();
    }

    // 푸시 메세지 수신 시 처리한다.
    onPushNotify = (data) => {
        console.log('[PushContainer] onPushNotify', data);
        if (data.handleType === 'opened') {
            // data.notification = {
            // 	displayType: 0,
            // 	payload: {
            // 		additionalData: {
            // 			type: MSG_TYPE.call,
            // 			subtype: MSG_SUBTYPE.request,
            // 			fromName: this.actorName,
            // 			fromActorId: this.actorId,
            // 			roomId,
            // 			time: Date.now()
            // 		},
            // 		body: '바뀐 메세지 형식으로 보냄',
            // 		lockScreenVisibility: 1,
            // 		title: '대제목'
            // 	}
            // }
            if (data.notification && data.notification.payload && data.notification.payload.additionalData) {
                const additionalData = data.notification.payload.additionalData;
                if (additionalData.type === 'CALL') {
                    if (Date.now() > additionalData.time + 35000) {
                        return setTimeout(() => {
                            console.log('통화 대기시간을 초과하여 통화 연결이 종료 되었습니다');
                        }, 3000);
                    } else {
                        if (!this.props.rnsLogined) {
                            this.props.pushPendingRequest(additionalData);
                        } else {
                            console.warn('[PushContainer] 영상 전화 요청 푸시를 받았으나, 이미 앱이 요청을 받았을 것이므로 별도의 처리는 안함');
                        }
                    }
                } else {
                    console.warn('[PushContainer] 영상 전화 요청이 아닌 기타 푸시 수신');
                }
            }
        }
    }
    onOpenChange(target){
        return this.setState({
            menu : false,
            mypage : false,
            [target] : !this.state[target],
        });
    }

    render() {
        return (
            <div>
                <StickyContainer className="contents-container">
                    {/*<HeaderContainer onOpenChange={this.onOpenChange}/>*/}
                    <WrapperContainer />
                    {/*<FooterContainer />*/}
                </StickyContainer>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(App);
