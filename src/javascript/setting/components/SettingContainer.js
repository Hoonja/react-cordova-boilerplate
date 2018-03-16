import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { path } from '../../commons/configs';
import { fetch } from '../../redux/actions';

import { Flex, Card, NavBar } from 'antd-mobile';
import { CustomIcon } from '../../commons/components';
import { Settings } from './';


const mapStateToProps = () => {
    return {
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        multipleList: (list) => dispatch(fetch.multipleList(list)),
        list: (url, params) => dispatch(fetch.list(url, params))
    }
};

class SettingContainer extends React.Component {
    componentDidMount() {
        this.getList();
    }

    getList() {
        // const {parent} = this.props;
        // const obj =  api.getFamily(parent.actorId);
        // return APICaller.get(obj.url, obj.params)
        //     .then(({data}) => {
        //         if(data.count === 0 ) {
        //             return ;
        //         }
        //         const obj = api.getMembers(data.results[0].id);
        //         return this.props.multipleList([{id:'familyMembers', url :obj.url, params : obj.params }]);
        //     });
    }


    render() {
        return (
            <div>
                <Flex direction="column" className="setting-wrapper">
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer);
