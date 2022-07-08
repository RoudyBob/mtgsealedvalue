import * as React from 'react';

import Login from './Login';
import Signup from './Signup';

export interface AuthProps {
    updateToken: Function,
    showLogin: boolean
}
 
export interface AuthState {

}
 
class Auth extends React.Component<AuthProps, AuthState> {
    // constructor(props: AuthProps) {
    //     super(props);
    //     this.state = {
    //         showLogin: true
    //     };
    // }

    render() { 

        return (
            <div className="auth-wrapper">
                {this.props.showLogin === true ? <Login updateToken={this.props.updateToken} /> : <Signup updateToken={this.props.updateToken} />}
            </div>
        );
    }
}
 
export default Auth;