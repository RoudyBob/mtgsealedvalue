import React from 'react';
import Table from 'react-bootstrap/Table';
import ItemDisplay from './ItemDisplay';

interface MainProps {
    token: string | null,
    userid: string | null
}
 
interface MainState {
  items: InventoryItems,
  totalCost: number,
  totalValue: number
}
 
export interface InventoryItem {
    id: number,
    productid: number,
    productname: string,
    datepurchased: Date | null,
    purchaseprice: number,
    purchasetax: number,
    purchaseshipping: number,
    notes: string,
    marketprice: number
};

interface InventoryItems extends Array<InventoryItem> {};

class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = {
          items: [{
            id: 0,
            productid: 0,
            productname: '',
            datepurchased: null,
            purchaseprice: 0,
            purchasetax: 0,
            purchaseshipping: 0,
            notes: '',
            marketprice: 0
          }],
          totalCost: 0,
          totalValue: 0
        };
        // this fixes cannote read proprities of undefined - https://www.bswen.com/2021/11/how-to-solve-cannot-read-properties-of-undefined-setState.html
        this.addToCost = this.addToCost.bind(this);
        this.addToValue = this.addToValue.bind(this);
    }

    async getInventoryInfo () {
      if(this.props.token) {
        const inventoryResponse = await fetch(`http://localhost:3001/product/mine`, {
          method: 'GET',
          headers: new Headers ({
              'Content-Type': 'application/json',
              'Authorization': this.props.token
          })
        });
        const inventoryData = await inventoryResponse.json();
        this.setState({ items: inventoryData });
        console.log(this.state.items.length)
        // console.log(this.state.items[0])
      };
    }


  addToCost (itemCost: number) {
    if (itemCost !== 0) {
      console.log(itemCost);
      this.setState(prevState => {
        return {totalCost: Number(prevState.totalCost) + 1};
      });
    }
  };

  addToValue (id: number, itemValue: number) {
    // this.setState({ totalValue: this.state.totalValue + 1 })
    if (itemValue !== 0) {
      console.log(id, itemValue);
      this.setState(prevState => {
        return {totalValue: prevState.totalValue + 1};
      });
    }
    // console.log(id, itemValue, this.state.totalValue);
    // console.log('In addToValue', itemValue, this.state.totalValue);
    // this.setState({ count: this.state.count + 1 });
    // console.log(itemValue, this.state.count);
    // var joined = this.state.totalValueArray.concat(itemValue);
    // this.setState({ totalValueArray: joined })
    // console.log("In addToValue");
    // console.log(itemValue);
    // console.log(this.state.totalValueArray);
    // let tempValue = this.state.totalValue.toFixed(2);
    // console.log(tempValue);
    // let newValue = Number(tempValue) + Number(itemValue);
    // console.log(newValue);
    // this.setState({ totalValue: newValue })
  };

    componentDidMount () {
      this.getInventoryInfo();
    }

    render() { 
        return (
          <div className="main">
            <Table className="displayTable" responsive="sm" bordered hover size="sm">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Date Purchased</th>
                <th>Market Price</th>
                <th>Cost Basis</th>
                <th>Profit/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items[0].productid !== 0 ? this.state.items.map((item, index) => {return <ItemDisplay item={item} keyId={index} addToCost={this.addToCost} addToValue={this.addToValue} />}) : null }
            </tbody>
          </Table>
          </div>
        );
    }
}
 
export default Main;