import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ItemDisplay from './ItemDisplay';
import AddItem from './AddItem';


interface MainProps {
    token: string | null,
    userid: string | null
}
 
interface MainState {
  items: InventoryItems,
  addModalOn: boolean
}
 
export interface InventoryItem {
    id: number,
    productid: number,
    productname: string,
    datepurchased: Date | null,
    purchaseprice: number,
    purchasetax: number,
    purchaseshipping: number,
    notes: string
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
            notes: ''
          }],
          addModalOn: false
        };
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
        // console.log(this.state.items[0])
      };
    }

    toggleAddModal = () => {
      this.setState(prevState => ({
        addModalOn: !prevState.addModalOn
      }));
    }
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
                <th>Market Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items[0].productid !== 0 ? this.state.items.map((item, index) => {return <ItemDisplay inventoryId={item.id} productId={item.productid.toString()} keyId={index}/>}) : null }
            </tbody>
          </Table>
          <AddItem addModalOn={this.state.addModalOn} toggleAddModal={this.toggleAddModal} />
          <Button onClick={() => this.toggleAddModal()}>Add Item</Button>
          </div>
        );
    }
}
 
export default Main;