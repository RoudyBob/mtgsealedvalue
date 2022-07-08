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

    redirectHome = () => {
        let navigate = useNavigate();
        navigate('/');
    };

    componentDidMount () {
        this.props.clearToken();
        this.redirectHome();
    }
    
    render() { 
        return (<div></div>);
    }
}
 
export default Logout;