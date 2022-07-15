import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import AddItem from './AddItem';

interface HeaderProps {
    token: string | null,
    toggleAddModal: Function
}
 
interface HeaderState {
    addModalOn: boolean
}

class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);
        this.state = {
            addModalOn: false
        };
    }

    toggleAddModal = () => {
        this.setState(prevState => ({
            addModalOn: !prevState.addModalOn
        }));
    }

    render() { 
        return ( 
            <div className="header">
                <Navbar bg="primary" variant="dark" fixed="top">
                    <Container>
                        <Navbar.Brand>Magic the Gathering: Sealed Value</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            {this.props.token ? <Nav.Link href="/logout">Logout</Nav.Link> : <Nav.Link href="/login">Login</Nav.Link>}
                        </Nav>
                        <Button className="addItemButton" variant="secondary" onClick={() => this.toggleAddModal()}>Add Item to Inventory</Button>
                    </Container>
                </Navbar>
                <AddItem addModalOn={this.state.addModalOn} toggleAddModal={this.toggleAddModal} token={this.props.token} />
            </div>
        );
    }
}
 
export default Header;