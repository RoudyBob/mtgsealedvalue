import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export interface LogoutProps {
    clearToken: Function
}
 
export interface LogoutState {
    
}
 
class Logout extends React.Component<LogoutProps, LogoutState> {
    // constructor(props: LogoutProps) {
    //     super(props);
    //     this.state = { :  };
    // }

    componentDidMount () {
        this.props.clearToken();
    }
    
    render() { 
        return (<div></div>);
    }
}
 
export default Logout;