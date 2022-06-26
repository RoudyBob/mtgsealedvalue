import React from 'react';
import ReactDOM from 'react-dom/client';
import ItemDisplay from './ItemDisplay';
import './App.css';

export interface tokenObject {
  access_token: string,
  expires: string
}

export interface itemObject {
  sku: string,
  name: string,
  price: number,
  imgUrl: string
}
export interface AppProps {

} 

export interface AppState {
  bearerToken: tokenObject,
  itemInfo: itemObject
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      bearerToken: {
        access_token: '',
        expires: ''
      },
      itemInfo: {
        sku: '',
        name: '',
        price: 0,
        imgUrl: ''
      }
    }
  };

  authGetter = async () => {
    let url: string = 'https://api.tcgplayer.com/token'
    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'grant_type=client_credentials&client_id=' + process.env.REACT_APP_TCG_PUBLICID + '&client_secret=' + process.env.REACT_APP_TCG_PRIVATEID,
      });
      let tokenData = await response.json();
      return tokenData;
    } catch (error) {
      console.log(error);
    }
  };

  authenticate = async () => {
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
      localStorage.setItem('tcgToken', this.state.bearerToken.access_token)
      localStorage.setItem('tcgTokenExpiry', this.state.bearerToken.expires)
    } catch (error) {
      console.log('Error Acquiring Bearer Token')
      console.log(error);
    }
  };

  getSkuByProductId = (productId: string) => {
    fetch(`https://api.tcgplayer.com/v1.39.0/catalog/products/` + productId + '/skus', {
        method: 'GET',
        headers: new Headers ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer l-e6F0cDctm89u__QgCM2IOVmYeccDqCXT4galN3VDAZu4QZ8SBehDEycZvjhNnDwLCTZdveL8n_Y1RuFY3rnpMHDPPCKQ2Y0mVkCc9_5iBi4herQePWiDF7gVbJXbmPxk8sLRByOnroZN0LfrPSaoqHOq6uf4UOzs1RZFF4hii0Db53CmCEi5cOxDDbPy5VDHmhTy3WbXnDKWq5-xDFp2Vrthwxsr_-tIu2RzXeXKb-9U0n9V9MRBrs0rehFeAjkZdSsyWwzFKtp-lQJPg4X2ZxK66Q2BAYju-BUEkJQfVGXYuG6EUp5iTaIOGtSzlnpryIKA`
        })
    })
    .then((response) => response.json())
    .then((productData) => {
        console.log(productData.results[0]);
        this.setState({
          itemInfo: {
            price: this.state.itemInfo.price,
            name: this.state.itemInfo.name,
            sku: productData.results[0].skuId,
            imgUrl: this.state.itemInfo.imgUrl
          }
        });
    })
  };

  getPriceBySku = (sku: string) => {
    fetch(`https://api.tcgplayer.com/v1.39.0/pricing/marketprices/` + sku, {
        method: 'GET',
        headers: new Headers ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer `
        })
    })
    .then((response) => response.json())
    .then((priceData) => {
        console.log(priceData.results[0]);
        this.setState({
          itemInfo: {
            price: priceData.results[0].price,
            name: this.state.itemInfo.name,
            sku: this.state.itemInfo.sku,
            imgUrl: this.state.itemInfo.imgUrl
          }
        });
    })
  };

  getProductInfoByProductId = (productId: string) => {
      fetch(`https://api.tcgplayer.com/v1.39.0/catalog/products/` + productId, {
          method: 'GET',
          headers: new Headers ({
              'Content-Type': 'application/json',
              'Authorization': `Bearer l-e6F0cDctm89u__QgCM2IOVmYeccDqCXT4galN3VDAZu4QZ8SBehDEycZvjhNnDwLCTZdveL8n_Y1RuFY3rnpMHDPPCKQ2Y0mVkCc9_5iBi4herQePWiDF7gVbJXbmPxk8sLRByOnroZN0LfrPSaoqHOq6uf4UOzs1RZFF4hii0Db53CmCEi5cOxDDbPy5VDHmhTy3WbXnDKWq5-xDFp2Vrthwxsr_-tIu2RzXeXKb-9U0n9V9MRBrs0rehFeAjkZdSsyWwzFKtp-lQJPg4X2ZxK66Q2BAYju-BUEkJQfVGXYuG6EUp5iTaIOGtSzlnpryIKA`
          })
      })
      .then((response) => response.json())
      .then((productData) => {
          console.log(productData.results[0]);
          this.setState({
            itemInfo: {
              price: this.state.itemInfo.price,
              name: productData.results[0].name,
              sku: this.state.itemInfo.sku,
              imgUrl: productData.results[0].imageUrl
            }
          });
      })
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

  componentDidUpdate(prevProps:AppProps, prevState:AppState) {
    if (prevState.itemInfo.sku !== this.state.itemInfo.sku) {
      this.getPriceBySku(this.state.itemInfo.sku);
    }
  };

  componentDidMount() {
    // Check to see if Bearer Token exists. If not, authenticate to TCGPlayer.
    if (!localStorage.getItem('tcgToken')) {
      console.log("no token - logging in")
      this.authenticate();
    // If Bearer Token exists, check the expiration. If it's expired, authenticate to TCGPlayer.
    } else {
      console.log(localStorage.getItem('tcgTokenExpiry'));
      const expiration = localStorage.getItem('tcgTokenExpiry');
      if (expiration) {
        let expirationDate = new Date(expiration.slice(12,16) + '-' + this.monthConverter(expiration.slice(8,11)) + '-' + expiration.slice(5,7) + 'T' + expiration.slice(17,25) + 'Z').toUTCString();
        console.log('Expiration Date: ' + expirationDate);
        let currentDate = new Date().toUTCString();
        console.log('Current Date: ' + currentDate);
        if (currentDate > expirationDate) {
          // Bearer Token Not Yet Expired
          console.log('token not yet expired  - no need to log in');
        } else {
          // Bearer Token Expired
          console.log('token expired - logging in');
          this.authenticate();
        }
      }
    }

    this.getProductInfoByProductId('271509');
    this.getSkuByProductId('271509');
  }

  render() {
    return (
      <div className="main">
        <h1>TCGPlayer API Testing</h1>
        <ItemDisplay />
        <p></p>
        <h3>{this.state.itemInfo.name}</h3>
        <img src={this.state.itemInfo.imgUrl} alt='Modern Horizons 2 Draft Booster Box'></img>
        <p>The SKU is: {this.state.itemInfo.sku}</p>
        <p>The market price is: {this.state.itemInfo.price}</p>
      </div>
    );
  }
}

export default App;
