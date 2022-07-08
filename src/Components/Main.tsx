import React from 'react';
import Table from 'react-bootstrap/Table';
import ItemDisplay from './ItemDisplay';

interface MainProps {
    token: string,
    userid: string
}
 
interface MainState {
    
}
 
export interface InventoryItem {
    inventoryId: number,
    productId: number,
    productName: string,
    datePurchased: Date,
    purchasePrice: number,
    purchaseTax: number,
    purchaseShipping: number,
    notes: string
};

interface InventoryItems extends Array<InventoryItem> {};

const productIdArray: Array<string> = ['275412','275403','271509','257563','236348','267023','221319','271506','267019','264767','264763','264760','257557','230384','255911','246457','246467','244384','244379','185894','238745','238730','236354','221323','221319','233232','233249','228249','228245','220414','214818','214811','208279','208273','202302','202298','194907','194891','188210','185676','180734','173362','166550','158423','149404','141989'];

class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return (
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
              {productIdArray.map((id, index) => {return <ItemDisplay productId={id} keyId={index}/>})}
            </tbody>
          </Table>
        );
    }
}
 
export default Main;