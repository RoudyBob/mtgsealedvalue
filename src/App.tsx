import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

export interface tokenObject {
  access_token: string | null,
  expires: string | null
}

export interface AppProps {

} 

export interface AppState {
  bearerToken: tokenObject;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      bearerToken: {
        access_token: '',
        expires: null
      }
    }
  };

  authGetter = async () => {
    let url: string = 'https://cors-anywhere.herokuapp.com/https://api.tcgplayer.com/token'
    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'grant_type=client_credentials&client_id=' + process.env.REACT_APP_TCG_PUBLICID + '&client_secret=' + process.env.REACT_APP_TCG_PRIVATEID,
      });
      let tokenData = await response.json();
      // console.log('grant_type=client_credentials&client_id=' + process.env.REACT_APP_TCG_PUBLICID + '&client_secret=' + process.env.REACT_APP_TCG_PRIVATEID);
      // console.log(process.env.REACT_APP_TCG_PUBLICID);
      // console.log(process.env.REACT_APP_TCG_PRIVATEID);
      // console.log(tokenData);
      return tokenData;
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    if (!localStorage.getItem('tcgToken')) {
      console.log("no token - logging in")
      const authenticate = async () => {
        try {
          let tokenData = await this.authGetter();
          console.log(tokenData);
          this.setState({ 
            bearerToken: {
              access_token: tokenData.access_token,
              expires: tokenData['.expires']
            }
          });
          console.log(this.state.bearerToken);
          // localStorage.setItem('tcgToken', this.state.bearerToken.access_token)
          // localStorage.setItem('tcgTokenExpiry', this.state.bearerToken.expires)
        } catch (error) {
          console.log(error);
        }
      }
      authenticate();
    } else {
      console.log("token - no need to log in");
      console.log(localStorage.getItem('tcgTokenExpiry').toISOString())
    }

  }

  render() {
    let url: string = 'http://api.tcgplayer.com/' + '/pricing/marketprices/5345922'
    
    // fetch(``, {

    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(data);
    // })

    return (
      <div className="main">
        <h1>Test from App Component</h1>
        <p>This is only a test.</p>
        <p>{url}</p>
      </div>
    );
  }
}

export default App;
