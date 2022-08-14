import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./Auth/Auth";
import Logout from "./Auth/Logout";
import Header from "./Components/Header";
import Main from "./Components/Main";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export interface AppProps {

} 

export interface AppState {
  sessionToken: string | null,
  userid: string,
  fullname: string,
  newToken: string,
  showLogin: boolean,
  bearerToken: tokenObject,
  addModalOn: boolean,
  totalCost: number,
  totalValue: number
} 

export interface tokenObject {
  access_token: string,
  expires: string
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      sessionToken: '',
      userid: '',
      fullname: '',
      newToken: '',
      showLogin: true,
      bearerToken: {
        access_token: '',
        expires: ''
      },
      addModalOn: false,
      totalCost: 0,
      totalValue: 0
    };
  };

  mainView = () => {
    return (this.state.sessionToken ? <Main token={this.state.sessionToken} userid={this.state.userid} /> : <Auth updateToken={this.updateToken} showLogin={true} />);
  };

  updateToken = (newToken: string, newUserid: string, firstname: string, lastname: string) => {
    let fname: string = firstname + ' ' + lastname;
    console.log(fname);
    console.log('in update token');
    console.log(newToken);
    localStorage.setItem('token', newToken);
    this.setState({ sessionToken: newToken});
    localStorage.setItem('userid', newUserid);
    this.setState({ userid: newUserid, fullname: fname });
    console.log(this.state.sessionToken)
  }

  clearToken = () => {
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    this.setState({ sessionToken: '' });
  }

  authGetter = async () => {
    // TODO: Fix the CORS issue without needing the proxy here.
    let url: string = 'https://cors-anywhere.herokuapp.com/https://api.tcgplayer.com/token'
    try {
      console.log(process.env.REACT_APP_TCG_PUBLICID);
      console.log(process.env.REACT_APP_TCG_PRIVATEID);
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'grant_type=client_credentials&client_id=' + process.env.REACT_APP_TCG_PUBLICID + '&client_secret=' + process.env.REACT_APP_TCG_PRIVATEID,
      });
      let tokenData = await response.json();
      console.log(tokenData);
      return tokenData;
    } catch (error) {
      console.log(error);
    }
  };

  authenticate = async () => {
    try {
      let tokenData = await this.authGetter();
      console.log(tokenData);
      localStorage.setItem('tcgToken', tokenData.access_token)
      localStorage.setItem('tcgTokenExpiry', tokenData['.expires'])
      this.setState({ 
        bearerToken: {
          access_token: tokenData.access_token,
          expires: tokenData['.expires']
        }
      });
      // TODO: For some reason, this is not setting the state properly
      console.log(this.state.bearerToken);
    } catch (error) {
      console.log('Error Acquiring Bearer Token')
      console.log(error);
    }
  };

  monthConverter = (monthName: string) => {
    switch (monthName) {
      case 'Jan':
        return '01';
      case 'Feb':
        return '02';
      case 'Mar':
        return '03';
      case 'Apr':
        return '04';
      case 'May':
        return '05';
      case 'Jun':
        return '06';
      case 'Jul':
        return '07';
      case 'Aug':
        return '08';      
      case 'Sep':
        return '09';
      case 'Oct':
        return '10';
      case 'Nov':
        return '11';
      case 'Dec':
        return '12';
      }
  }

  updateCost (total: number) {
    this.setState({ totalCost: total })
  };

  updateValue (total: number) {
    this.setState({totalValue: total });
  }

  toggleAddModal = () => {
    this.setState(prevState => ({
      addModalOn: !prevState.addModalOn
    }));
  }

  componentDidMount() {
    // Check to see if Auth Token exists. 
    if (localStorage.getItem('token')) {
      this.setState({
        sessionToken: localStorage.getItem('token')
      })
    }
    // Check to see if Bearer Token exists. If not, authenticate to TCGPlayer.
    if (!localStorage.getItem('tcgToken')) {
      console.log("no token - logging in")
      this.authenticate();
    // If Bearer Token exists, check the expiration. If it's expired, authenticate to TCGPlayer.
    } else {
      // console.log(localStorage.getItem('tcgTokenExpiry'));
      const expiration = localStorage.getItem('tcgTokenExpiry');
      if (expiration) {
        let expirationDate = new Date(expiration.slice(12,16) + '-' + this.monthConverter(expiration.slice(8,11)) + '-' + expiration.slice(5,7) + 'T' + expiration.slice(17,25) + 'Z').toUTCString();
        console.log('Expiration Date: ' + expirationDate);
        let currentDate = new Date().toUTCString();
        console.log('Current Date: ' + currentDate);
        if (currentDate < expirationDate) {
          // Bearer Token Not Yet Expired
          console.log('token not yet expired  - no need to log in');
        } else {
          // Bearer Token Expired
          console.log('token expired - logging in');
          // TODO: Make this a synchronous function as the rest of the application needs to wait until the bearer token exists.
          this.authenticate();
        }
      }
    }
  };

  render() {
    return (
      <div className="App">
        <Header token={this.state.sessionToken} toggleAddModal={this.toggleAddModal} totalCost={this.state.totalCost} totalValue={this.state.totalValue} />
        <Routes>
          {/* <Route path="/" element={<Main token={this.state.sessionToken} userid={this.state.userid}/>}></Route> */}
          <Route path="/" element={this.mainView()}></Route>
          <Route path="/login" element={<Auth updateToken={this.updateToken} showLogin={true} />}></Route>
          <Route path="/signup" element={<Auth updateToken={this.updateToken} showLogin={false} />}></Route>
          <Route path="/logout" element={<Logout clearToken={this.clearToken} />}></Route>
        </Routes>

      </div>
    );
  }
}

export default App;
