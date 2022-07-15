import React from 'react';
import { Form, Alert } from 'react-bootstrap';

export interface LoginProps {
    updateToken: Function
};
 
export interface LoginState {
    email: string,
    password: string,
    alertVisible: boolean
};

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = { 
            email: '', 
            password: '',
            alertVisible: false
        };
    }

    handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('In handleSubmit')
        fetch(`http://localhost:3001/user/login`, {
            method: 'POST',
            body: JSON.stringify({user: {email: this.state.email, password: this.state.password}}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.hasOwnProperty("error")) {
                this.setState({ alertVisible: true })
            } else {
                console.log(data);
                this.props.updateToken(data.sessionToken, data.user.id, data.user.firstname, data.user.lastname);
            }
        })  
    }

    toggleAlert = () => {
        this.setState(prevState => ({
            alertVisible: !prevState.alertVisible
        }));
    }

    render() { 
        return ( 
            <div className="auth-inner">
                <div className="failedLogin">
                    <Alert color="danger" dismissible show={this.state.alertVisible} onClose={this.toggleAlert}>
                        Login Failed - Try Again.
                    </Alert>
                </div>
                <Form onSubmit={this.handleSubmit}>
                    <h3>RunJournal Sign In</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: e.currentTarget.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: e.currentTarget.value })} required />
                    </div>

                    <br/>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    <p className="signup-login text-right">
                        Not registered? <a href="/signup">Sign up.</a>
                    </p>
                </Form>

            </div>
        );
    }
}
 
export default Login;