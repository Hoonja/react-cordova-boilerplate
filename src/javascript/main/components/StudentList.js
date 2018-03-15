import React from 'react';
import { connect } from 'react-redux';

import { api, service } from '../../commons/configs';
import { fetch } from '../../redux/actions';
import { path } from '../../commons/configs';
import { push } from 'react-router-redux';

import { Button, List, Modal } from 'antd-mobile';
import { APICaller } from 'wink_mobile_commons/dist/api';

const Item = List.Item;

const mapStateToProps = ({ fetch, security }) => {
    const students = (service.getValue(fetch, 'multipleList.familyMembers.results') || []).filter(item => item.modelType === 1);
    return {
        item: fetch.item,
        parent: security.actor,
        room: service.getValue(fetch, 'multipleList.room', {}),
        students
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        get: (url, params) => dispatch(fetch.get(url, params)),
        multipleList: (list) => dispatch(fetch.multipleList(list)),
        move: (location) => dispatch(push(location)),
    }
};

class StudentList extends React.Component {
    state = {
    };
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        const {parent} = this.props;
        const obj = api.getFamily(parent.id);
        return APICaller.get(obj.url, obj.params)
            .then(({data}) => {
                if(data.count === 0 ) {
                    return ;
                }
                const obj = api.getMembers(data.results[0].id);
                return this.props.multipleList([{id:'familyMembers', url :obj.url, params : obj.params }]);
            });
    }

    call(item) {
        const { parent } = this.props;
        const obj = api.getRoomId({name: `${parent.id}_${item.id}`});
        return this.props.multipleList([{id:'room', url :obj.url, params : obj.params }])
        // return APICaller.get(obj.url, obj.params)
            .then(() => {
                const {room} = this.props;
                if(room.id) {
                    this.props.move(path.video);
                } else {
                    console.log('room이 없음');
                    return ;
                }
            });
    }

    call2(item) {
        const { parent } = this.props;
        const obj = api.getRoomId({name: `${parent.id}_${item.id}`});
        return this.props.multipleList([{id:'room', url :obj.url, params : obj.params }])
        // return APICaller.get(obj.url, obj.params)
            .then(() => {
                const {room} = this.props;
                if(room.id) {
                    this.props.move(path.video2);
                } else {
                    console.log('room이 없음');
                    return ;
                }
            });
    }

    confirmModal(e, item) {
        e.preventDefault();
        const title = `${item.authHumanName} 학생에게 영상통화 하시겠습니까?`;
        Modal.alert('영상통화', title, [
            { text: '취소', onPress: () => {return false;}, style: 'default'},
            { text: '확인', onPress: () => this.call(item)}
        ]);
    }

    confirmModal2(e, item) {
        e.preventDefault();
        const title = `${item.authHumanName} 학생에게 영상통화 하시겠습니까?(fake)`;
        Modal.alert('영상통화', title, [
            { text: '취소', onPress: () => {return false;}, style: 'default'},
            { text: '확인', onPress: () => this.call2(item)}
        ]);
    }

    render() {
        const {students} = this.props;

        return (
            <div>
                <List renderHeader={() => ''} className="main-student-list">
                    {students.map((item, index) => {
                        return (
                            <Item key={index}
                                  extra={
                                      <Button type="primary" size="small" onClick={e => this.confirmModal(e, item)}>전화 걸기</Button>
                                  }>
                                <span onClick={e => this.confirmModal2(e, item)}>{item.authHumanName}</span>
                            </Item>
                        )
                    })}
                </List>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentList);
