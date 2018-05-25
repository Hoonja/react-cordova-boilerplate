import React from 'react';
import { connect } from 'react-redux';
import studentM from '../../../resource/student_m.png';
import studentW from '../../../resource/student_w.png';

import { api, service } from '../../commons/configs';
import { CustomIcon } from '../../commons/components';
import { fetch, socket as action } from '../../redux/actions';
import { path, values } from '../../commons/configs';
import { push } from 'react-router-redux';

import { List, Modal } from 'antd-mobile';
import { APICaller } from '../../mobileCommons/api';

const Item = List.Item;

const mapStateToProps = ({ fetch, security }) => {
    const students = (service.getValue(fetch, 'multipleList.familyMembers.results') || []).filter(item => item.modelType === 1);
    return {
        parent: security.actor,
        room: service.getValue(fetch, 'multipleList.room', {}),
        students
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        multipleList: (list) => dispatch(fetch.multipleList(list)),
        move: (location) => dispatch(push(location)),
        updateVideoCallStatus: (callStatus, item) => dispatch(action.updateVideoCallStatus(callStatus, item))
    }
};

class StudentList extends React.Component {
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
            .then(() => {
                const {room} = this.props;
                if(room.id) {
                    this.props.updateVideoCallStatus(values.callStatus.CALL_WAIT, {});
                    this.props.move(path.video);
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

    receiveCall(e, item) {
        e.preventDefault();
        console.log('receiveCall');
        return ;

        const receiveInfo = {
            roomId: '7291_7293',
            fromName: '정주어',
            fromActorId: '7293'
        };
        this.props.updateVideoCallStatus(values.callStatus.RECEIVED, receiveInfo);
        this.props.move(path.video);
    }

    renderStudent(student) {
        return (
            <Item
                thumb={service.getValue(student, 'sdata.authDetail.isMail', false) ? studentM : studentW}
                extra={
                  <CustomIcon type="MdPhone" className="call-button" onClick={e => this.confirmModal(e, student)}/>
                }>
                <span onClick={e => this.receiveCall(e, student)}>{student.authHumanName}</span>
            </Item>
        )
    }

    render() {
        const {students} = this.props;
        return (
            <div>
                <List className="main-student-list">
                    {students.map(student => this.renderStudent(student))}
                </List>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentList);
