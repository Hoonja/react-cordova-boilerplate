import React from 'react';
import { connect } from 'react-redux';
import {push} from "react-router-redux";

import { service } from '../../commons/configs';
import { socket as socketAction } from '../../redux/actions';

import {VideoPhone} from './';

const mapStateToProps = ({ fetch, security }) => {
    const room = service.getValue(fetch, 'multipleList.room', {});
    const student = service.getValue(room, 'sdata.studentDetail', {});
    return {
        parent: {...security.actor},
        student,
        room
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        moveHome: () => dispatch(push('/')),
        connect: (params) => {
            return dispatch(socketAction.connect(params));
        },
    }
};

class VideoContainer extends React.Component {
    componentDidMount() {
        this.props.connect({localResource: {localVideoEl: 'vidSelf'}});
    }

    onClose() {
        this.props.moveHome();
    }

    render() {
        return (
            <div>
                <VideoPhone data={{...this.props}} onClose={this.onClose.bind(this)}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoContainer);
