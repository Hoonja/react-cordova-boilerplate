import React from 'react';
import { Route  } from 'react-router-dom';
import {AuthRoute} from 'wink_mobile_commons/dist/security/components';

import { path } from '../commons/configs';
import { SettingContainer } from '../setting/components';

class Setting extends React.Component {

    render() {
        return (
            <div className="main-container">
                <Route exact path={path.setting} component={SettingContainer} />
            </div>
        );
    }

}

export default Setting;
