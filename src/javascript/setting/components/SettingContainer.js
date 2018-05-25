import React from 'react';
import { NavLink } from 'react-router-dom';

import { path } from '../../commons/configs';

import { Flex, NavBar } from 'antd-mobile';
import { CustomIcon } from '../../commons/components';
import { Settings } from './';

class SettingContainer extends React.Component {

    render() {
        return (
            <div>
                <Flex direction="column" className="setting-wrapper" style={{paddingTop: 'max(12px, env(safe-area-inset-top))'}}>
                    <Flex.Item className="setting-navbar">
                        <NavBar
                            mode="dark"
                            leftContent={
                                <NavLink to={ path.main } className="setting-navbar-menu">
                                    <CustomIcon roots="FontAwesome" type="FaChevronLeft" />
                                </NavLink>
                            }
                            className="setting-navbar-title"
                        >설정</NavBar>
                    </Flex.Item>
                    <Flex.Item className="setting-list">
                        <Settings/>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }
}

export default SettingContainer;
