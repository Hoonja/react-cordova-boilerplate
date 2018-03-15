import React from 'react';
import { Route  } from 'react-router-dom';
import {AuthRoute} from 'wink_mobile_commons/dist/security/components';

import { path } from '../commons/configs';
import { MainContainer } from '../main/components';
import { FooterNavigation, FooterContainer } from '../layout';

class Main extends React.Component {

    render() {
        return (
            <div className="main-container">
                <Route exact path={path.main} component={MainContainer} />
                <FooterContainer />
                <FooterNavigation />
            </div>
        );
    }

}

export default Main;
