import React from 'react';
import { connect } from 'react-redux';

import { StudentList } from './';
import main from '../../../resource/main.png';

import { Flex } from 'antd-mobile';

const mapStateToProps = ({ fetch, security }) => {
    return {
        parent: security,
    }
};
class MainContainer extends React.Component {

    render() {
        const {parent} = this.props;
        const name = parent.humanName + ((parent.userName.indexOf('@noid') > -1 || parent.userName.indexOf('@named') > -1) ? '' : `(${parent.userName})`);
        return (
            <div>
                <Flex direction="column" className="main-wrapper">
                    <Flex.Item className="main-top">
                        <div className="main-top-hello">안녕하세요,</div>
                        <div className="main-top-name">{`${name}님!`}</div>
                        <img src={main} alt="main" className="main-top-img"/>
                    </Flex.Item>
                    <Flex.Item className="main-student">
                        <StudentList/>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(MainContainer);
