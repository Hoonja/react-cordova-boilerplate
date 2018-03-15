import React from 'react';
import { connect } from 'react-redux';

import imgMenu from '../../../resource/menu.svg';
import imgUser from '../../../resource/user.svg';
import imgLogo from '../../../resource/logo.png';

import { fetch } from '../../redux/actions/index';
import { NavBar } from 'antd-mobile';

import { CustomIcon } from '../../commons/components';

const mapStateToProps = ({}) => {
    return {

    }
};

const mapDispatchProps = dispatch => ({
    reset: () => dispatch(fetch.reset()),
    getItem: (url, params, isNoWarning) => dispatch(fetch.get(url, params, isNoWarning)),
    getMultipleList: (list) => dispatch(fetch.multipleList(list)),
    resetMultipleList: () => dispatch(fetch.resetMultipleList()),
    // goBack: () => dispatch(goBack()),
    // move: (location) => dispatch(push(location))
});

class HeaderContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            menu : false,
            mypage : false,
        };

        this.onOpenChange = this.onOpenChange.bind(this);
        this.getLeftContent = this.getLeftContent.bind(this);
        this.getRightContent = this.getRightContent.bind(this);
    }

    getLeftContent(){
        return [
            <CustomIcon type={imgMenu} key="0" className="am-icon-left" />
        ];
    }

    getRightContent(){
        return [
            <CustomIcon type={imgUser} key="0" className="am-icon-right"  onClick={this.onOpenChange.bind(this, 'mypage')}/>
        ]
    }


    onOpenChange(target = null){
        const state = `${target}`;

        this.props.onOpenChange(state);
    }

    render() {

        return (
            <div className="header-container">
                <NavBar
                    mode="light"
                    onLeftClick={this.onOpenChange.bind(this, 'menu')}
                    leftContent={this.getLeftContent()}
                    rightContent={this.getRightContent()}
                    className="header-wrap"
                >
                    <img src={imgLogo} alt="logo"/>
                </NavBar>

            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(HeaderContainer);
