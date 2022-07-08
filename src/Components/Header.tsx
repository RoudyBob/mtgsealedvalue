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
                <h1>TCG Player Sealed Magic: The Gathering Market Prices</h1>
            </div>
        );
    }
}
 
export default Header;