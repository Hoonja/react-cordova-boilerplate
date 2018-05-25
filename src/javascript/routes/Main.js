import React from 'react';
import { Route  } from 'react-router-dom';

import { path } from '../commons/configs';
import { MainContainer } from '../main/components';
import { FooterNavigation, FooterContainer } from '../layout';

class Main extends React.Component {

    render() {
        return (
            <div className="main-container" style={{paddingTop: 'max(12px, env(safe-area-inset-top))'}}>
                <Route exact path={path.main} component={MainContainer} />
                <FooterContainer />
                <FooterNavigation />
            </div>
        );
    }

}

export default Main;
