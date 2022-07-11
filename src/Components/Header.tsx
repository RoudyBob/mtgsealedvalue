import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
    token: string | null    
}
 
interface HeaderState {
    
}
 
class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return ( 
            <div className="header">
                <h3>Magic the Gathering: Sealed Value</h3>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                        <div className="collapse navbar-collapse" id="main-navbar">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/"}>Home</Link>
                                </li>
                                <li className="nav-item">
                                    {this.props.token ? <Link className="nav-link" to={"/logout"}>Logout</Link> : <Link className="nav-link" to={"/login"}>Login</Link>}
                                </li>
                            </ul>
                        </div>
                </nav>
            </div>
        );
    }
}
 
export default Header;