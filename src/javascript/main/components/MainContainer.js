import React from 'react';
import { connect } from 'react-redux';

import { StudentList } from './';

import { Flex, Card } from 'antd-mobile';

const mapStateToProps = ({ fetch, security }) => {
    return {
        parent: security,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
    }
};

class MainContainer extends React.Component {

    componentDidMount() {
        // this.getList();
    }

    render() {
        const {parent} = this.props;
        return (
            <div>
                <Flex direction="column" className="login-wrapper">
                    <Flex.Item className="main-img">
                        {`안녕하세요, ${parent.humanName}(${parent.userName})님!`}
                    </Flex.Item>
                    <Flex.Item className="main-student">
                        <StudentList/>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
