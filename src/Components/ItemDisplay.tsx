import React from 'react';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import EditItem from './EditItem';


export interface itemObject {
    name: string,
    price: number,
    imgUrl: string
}

export interface ItemDisplayProps {
    productId: string,
    inventoryId: number,
    keyId: number
}

export interface ItemDisplayState {
    itemInfo: itemObject,
    editModalOn: boolean
};

class ItemDisplay extends React.Component<ItemDisplayProps, ItemDisplayState> {
    constructor(props: ItemDisplayProps) {
        super(props);
        this.state = {
          itemInfo: {
            name: '',
            price: 0,
            imgUrl: ''
          },
          editModalOn: false
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
                        imgUrl: this.state.itemInfo.imgUrl
                    }
                });
            }
        });
        // TODO: Add error catching

    };

    componentDidMount() {
        this.getProductInfoByProductId(this.props.productId);
    }

    toggleEditModal = () => {
        this.setState(prevState => ({
          editModalOn: !prevState.editModalOn
        }));
    }

    render() {
        return (
                <tr key={this.props.keyId.toString()}>
                    <td align="center"><img src={this.state.itemInfo.imgUrl} width='75' alt='Product Box Shot'></img></td>
                    <td>{this.props.productId}</td>
                    <td>{this.state.itemInfo.name}</td>
                    <td>${this.state.itemInfo.price}</td>
                    <td>
                        <EditItem inventoryId={this.props.inventoryId} editModalOn={this.state.editModalOn} toggleEditModal={this.toggleEditModal} />
                        <Button onClick={() => this.toggleEditModal()}>Edit</Button>
                    </td>
                </tr>
    )}
}

export default ItemDisplay;