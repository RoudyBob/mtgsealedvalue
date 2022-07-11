import React from 'react';
import { Form, FormLabel } from 'react-bootstrap';

export interface SignupProps {
    updateToken: Function,
}
 
export interface SignupState {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    currency: string
}
 
class Signup extends React.Component<SignupProps, SignupState> {
    constructor(props: SignupProps) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            currency: ''
        };
    }

    handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch(`http://localhost:3001/user/signup`, {
            method: 'POST',
            body: JSON.stringify({
                user: {
                    firstname: this.state.firstName,
                    lastname: this.state.lastName,
                    email: this.state.email,
                    currency: this.state.currency,
                    password: this.state.password
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        .then((response) => response.json())
        .then((data) => {
            this.props.updateToken(data.sessionToken, data.user.id);
        })
    }

    render() { 

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <Form onSubmit={this.handleSubmit}>
                        <h3>MTG Sealed Value Signup</h3>
                        <div className="form-group">
                            <FormLabel>First name</FormLabel>
                            <input type="text" className="form-control" placeholder="First name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ firstName: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Last name</label>
                            <input type="text" className="form-control" placeholder="Last name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ lastName: e.currentTarget.value })} required />
                        </div>

                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: e.currentTarget.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Enter password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: e.currentTarget.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <input type="password" className="form-control" placeholder="(e.g. USD)" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ currency: e.currentTarget.value })} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                        <p className="signup-login text-right">
                            Already registered? <a href="/login">Sign in.</a>
                        </p>
                    </Form>
                </div>
            </div>
        );
    }
}
 
export default Signup;