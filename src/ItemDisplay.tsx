import React from 'react';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export interface itemObject {
    sku: string,
    name: string,
    price: number,
    imgUrl: string
}

export interface ItemDisplayProps {
    productId: string,
    keyId: number
}

export interface ItemDisplayState {
    itemInfo: itemObject
}

class ItemDisplay extends React.Component<ItemDisplayProps, ItemDisplayState> {
    constructor(props: ItemDisplayProps) {
        super(props);
        this.state = {
          itemInfo: {
            sku: '',
            name: '',
            price: 0,
            imgUrl: ''
          }
        }
      };

    // async getSkuByProductId (productId: string) {
    //     const bearerToken: string | null = localStorage.getItem('tcgToken')
    //     const productResponse = await fetch(`https://api.tcgplayer.com/v1.39.0/catalog/products/` + productId + '/skus', {
    //         method: 'GET',
    //         headers: new Headers ({
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + bearerToken,
    //         })
    //     })
    //     const productData = await productResponse.json();
    //     console.log(productData.results[0]);
    //     this.setState({
    //         itemInfo: {
    //         price: this.state.itemInfo.price,
    //         name: this.state.itemInfo.name,
    //         sku: productData.results[0].skuId,
    //         imgUrl: this.state.itemInfo.imgUrl
    //         }
    //     });
    // };
    
    // async getPriceBySku (sku: string) {
    //     const bearerToken: string | null = localStorage.getItem('tcgToken')
    //     const response = await fetch(`https://api.tcgplayer.com/v1.39.0/pricing/marketprices/` + sku, {
    //         method: 'GET',
    //         headers: new Headers ({
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + bearerToken,
    //         })
    //     })
    //     const priceData = await response.json();
    //     this.setState({
    //         itemInfo: {
    //             price: priceData.results[0].price.toFixed(2),
    //             name: this.state.itemInfo.name,
    //             sku: this.state.itemInfo.sku,
    //             imgUrl: this.state.itemInfo.imgUrl
    //         }
    //     });
    // };
    
    async getProductInfoByProductId (productId: string) {
        const bearerToken: string | null = localStorage.getItem('tcgToken')
        const productResponse = await fetch(`https://api.tcgplayer.com/v1.39.0/catalog/products/` + productId, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            })
        });
        const productData = await productResponse.json();
        // console.log(productData.results[0]);
        this.setState({
            itemInfo: {
                price: this.state.itemInfo.price,
                name: productData.results[0].name,
                sku: this.state.itemInfo.sku,
                imgUrl: productData.results[0].imageUrl
            }
        });
        // TODO: Add error catching

        const priceResponse = await fetch(`https://api.tcgplayer.com/v1.39.0/pricing/product/` + productId, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            })
        })
        const priceData = await priceResponse.json();
        priceData.results.forEach ((priceInfo: any) => {
            if (priceInfo.subTypeName === "Normal") {
                // console.log(priceInfo);
                this.setState({
                    itemInfo: {
                        price: priceInfo.marketPrice.toFixed(2),
                        name: this.state.itemInfo.name,
                        sku: this.state.itemInfo.sku,
                        imgUrl: this.state.itemInfo.imgUrl
                    }
                });
            }
        });
        // TODO: Add error catching

    };

    componentDidUpdate(prevProps:ItemDisplayProps, prevState:ItemDisplayState) {
        // if (prevState.itemInfo.sku !== this.state.itemInfo.sku) {
        //   this.getPriceBySku(this.state.itemInfo.sku);
        // }
    };

    componentDidMount() {
        this.getProductInfoByProductId(this.props.productId);
        // this.getSkuByProductId(this.props.productId);
    }

    render() {
        return (
            <tr key={this.props.keyId.toString()}>
                <td align="center"><img src={this.state.itemInfo.imgUrl} width='75' alt='Product Box Shot'></img></td>
                <td>{this.props.productId}</td>
                <td>{this.state.itemInfo.name}</td>
                <td>${this.state.itemInfo.price}</td>
                <td><Button>Edit</Button></td>
            </tr>
        )
    }
}

export default ItemDisplay;