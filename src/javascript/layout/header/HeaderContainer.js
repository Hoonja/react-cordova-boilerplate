import React from 'react';

import imgLogo from '../../../resource/logo.png';

import { NavBar } from 'antd-mobile';

import { CustomIcon } from '../../commons/components';

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
            <CustomIcon type={imgLogo} key="0" className="am-icon-left" />
        ];
    }

    getRightContent(){
        return [
            <CustomIcon type={imgLogo} key="0" className="am-icon-right"  onClick={this.onOpenChange.bind(this, 'mypage')}/>
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

export default HeaderContainer;
