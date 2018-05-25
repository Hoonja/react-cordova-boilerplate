/* global appAvailability */

import React from 'react';
import logo from '../../../resource/logo.png';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Tabs } from 'antd-mobile';
import { Sticky } from 'react-sticky';

import { service } from '../../commons/configs';
import { CustomIcon } from '../../commons/components';


const mapStateToProps = ({layout}) => {

    const menu = service.getValue(layout, 'footerList')
    .filter(item => item.level === 0);

    return {
        menu
    }
};

class FooterNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.renderTabBar = this.renderTabBar.bind(this);
    }

    openParentApp() {
        var parentApp = 'winkparentapp';
        window.open = window.cordova.InAppBrowser.open;

        appAvailability.check(
            parentApp + '://',
            () => {
                window.open('winkparentapp://go/to/path?param1=12&param2=34', '_system');
            },
            () => {
                window.cordova.plugins.market.open('id1294082776', {
                    success: function () {
                        console.log('market open success');
                    },
                    error: function () {
                        console.log('market open error');
                    }
                });
            }
        )
    }

    renderTab(tab){
        switch(tab.id){
            case '100000000':
                return (
                    <div className="navigation-menu" onClick={() => this.openParentApp()}>
                        <CustomIcon type={tab.type} className="custom-icon" /> 윙크 학부모앱
                    </div>
                );
            case '300000000':
                return (
                    <NavLink to={ tab.link } className="navigation-menu">
                        <CustomIcon type={tab.type} roots="FontAwesome" className="custom-icon" /> 설정
                    </NavLink>
                )
            default:
                return (
                    <div className="navigation-menu">
                        <img src={logo} alt="logo" className="logo"/>
                    </div>
                )
        }
    }

    renderTabBar(props) {
        return (
            <Sticky>
                {(params) => {
                    const { style } = params;
                    style.top = 'auto';
                    style.bottom = 0;
                    return(
                        <div style={{...style, zIndex: 3 }} >
                            <Tabs.DefaultTabBar
                                {...props}
                                renderTab={tab => this.renderTab(tab)}
                            />
                        </div>
                    );
                }}
            </Sticky>
        );
    }

    render() {
        const { menu } = this.props;

        return (
            <div className="footer-navigations">
                <Tabs
                    tabs={menu}
                    tabBarPosition="bottom"
                    renderTabBar={this.renderTabBar}
                    tabBarBackgroundColor="#00bcd5"
                    tabBarTextStyle={{color:'#fff'}}
                />
            </div>
        );
    }

}

export default connect(mapStateToProps)(FooterNavigation);
