import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Session from '../services/SessionService';

export const AuthRoute = ({component, ...rest}) => (
    <Route {...rest} render={(props) => (
        Session.isLogin === true ?
        React.createElement(component, props) :
        (<Redirect to="/login"/>)
    )}/>
);
export default AuthRoute;