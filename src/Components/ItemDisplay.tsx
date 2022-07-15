import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import EditItem from './EditItem';
import { InventoryItem } from './Main';

export interface itemObject {
    name: string,
    price: number,
    imgUrl: string
}

export interface ItemDisplayProps {
    item: InventoryItem,
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
        this.getProductInfoByProductId(this.props.item.productid.toString());
    }

    toggleEditModal = () => {
        this.setState(prevState => ({
          editModalOn: !prevState.editModalOn
        }));
    }

    calculateCostBasis(): string {
        let costBasis = parseFloat(this.props.item.purchaseprice.toString()) + parseFloat(this.props.item.purchasetax.toString()) + parseFloat(this.props.item.purchaseshipping.toString())
        return costBasis.toFixed(2)
    }

    calculateProfit(): any {
        if (this.state.itemInfo.price > 0) {
            let profit = this.state.itemInfo.price - (parseFloat(this.props.item.purchaseprice.toString()) + parseFloat(this.props.item.purchasetax.toString()) + parseFloat(this.props.item.purchaseshipping.toString()))
            if (profit < 0) {
                return (<span className="negativeNumber">${profit.toFixed(2)}</span>)
            } else {
                return (<span className="positiveNumber">${profit.toFixed(2)}</span>)
            }
        } else {
            return (<span className="neutralNumber">N/A</span>)
        }

    }

    displayDate(): string | undefined {
        if (this.props.item.datepurchased) {
            return new Date(this.props.item.datepurchased).toLocaleDateString()
        }
    }

    render() {
        return (
                <tr key={this.props.keyId.toString()}>
                    <td align="center">
                        <img onError={({ currentTarget }) => { 
                            currentTarget.onerror = null;
                            currentTarget.src="https://product-images.tcgplayer.com/fit-in/437x437/image-missing.svg" }}
                            src={this.state.itemInfo.imgUrl} width='25' alt='Product Box Shot'>
                        </img>
                    </td>
                    <td>{this.props.item.productid}</td>
                    <td>{this.state.itemInfo.name}</td>
                    <td>{this.displayDate()}</td>
                    <td>${this.state.itemInfo.price}</td>
                    <td>${this.calculateCostBasis()}</td>
                    <td>{this.calculateProfit()}</td>
                    <td>
                        <EditItem inventoryId={this.props.item.id} editModalOn={this.state.editModalOn} toggleEditModal={this.toggleEditModal} />
                        <div className="listButtonsGroup">
                            <Button className="listButtons" variant="primary" onClick={() => this.toggleEditModal()}>📝</Button>
                            <Button className="listButtons" variant="danger" onClick={() => this.toggleEditModal()}>🗑</Button>
                        </div>
                        
                    </td>
                </tr>
    )}
}

export default ItemDisplay;