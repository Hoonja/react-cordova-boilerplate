import React from 'react';

import {  Drawer, List, Icon } from 'antd-mobile';

import { MenuList, MyPage } from '../';


class DrawerContainer extends React.Component {

    constructor(props) {
        super(props);
        this.onOpenChange = this.onOpenChange.bind(this);
    }

    onOpenChange(){
        this.props.onOpenChange()
    }

    makeDrawer(target = {}, children){
        const activeKey = Object.keys(target).filter(item => !!target[item])[0];

        if(activeKey === 'mypage'){
            return (
                <Drawer
                    className="main-drawer"
                    position='right'
                    sidebar={(<MyPage />)}
                    open={target[activeKey]}
                    onOpenChange={this.onOpenChange}
                >
                    {children}
                </Drawer>
            );
        }else if(activeKey === 'menu'){
            return (
                <Drawer
                    className="main-drawer"
                    position='left'
                    sidebar={(<MenuList />)}
                    open={target[activeKey]}
                    onOpenChange={this.onOpenChange}
                >
                    {children}
                </Drawer>
            );
        }

        return (
            <div className="drawer-container-no-sidebar">
                {children}
            </div>
        );
    }


    render() {
        const { state, children } = this.props;

        return (
            <div className="drawer-container">
                {this.makeDrawer(state, children)}
            </div>
        );
    }

}

export default DrawerContainer;
