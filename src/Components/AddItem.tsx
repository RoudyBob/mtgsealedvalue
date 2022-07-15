import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel'
import { InventoryItem } from './Main';
import { Item } from 'react-bootstrap/lib/Breadcrumb';

interface AddItemProps {
    addModalOn: boolean,
    toggleAddModal: Function,
    token: string | null
}
 
interface AddItemState {
    id: number,
    productid: string,
    productname: string,
    datepurchased: string, 
    purchaseprice: string,
    purchasetax: string,
    purchaseshipping: string,
    notes: string,
    quantity: number
}

class AddItem extends React.Component<AddItemProps, AddItemState> {
    constructor(props: AddItemProps) {
        super(props);
        this.state = {
            id: 0,
            productid: '',
            productname: '',
            datepurchased: '', 
            purchaseprice: '',
            purchasetax: '',
            purchaseshipping: '',
            notes: '',
            quantity: 1
        };
    }

    async addItemToInventory (item: InventoryItem) {
        console.log('Writing New Item');
        console.log(item);
        if(this.props.token) {
          const inventoryResponse = await fetch(`http://localhost:3001/product`, {
            method: 'POST',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            }),
            body: JSON.stringify({
                product: {
                    productid: item.productid,
                    productname: item.productname,
                    datepurchased: item.datepurchased, 
                    purchaseprice: item.purchaseprice,
                    purchasetax: item.purchasetax,
                    purchaseshipping: item.purchaseshipping,
                    notes: item.notes
                }
            })
          });
          console.log(inventoryResponse);
        };
    }

    handleClose = () => {
        this.props.toggleAddModal();
        this.setState({ productname: '' });
        this.setState({ quantity: 1 });
    };

    handleSubmit = () => {
        // console.log('Clicked Submit');
        // console.log(this.state.productid);
        // console.log(this.state.productname);
        // console.log(this.state.datepurchased)
        // console.log(this.state.purchaseprice);
        // console.log(this.state.purchasetax);
        // console.log(this.state.purchaseshipping);
        // console.log(this.state.notes);
        let newItem: InventoryItem = {
            id: 0,
            productid: parseInt(this.state.productid),
            productname: this.state.productname,
            datepurchased: new Date(this.state.datepurchased), 
            purchaseprice: parseFloat(parseFloat(this.state.purchaseprice).toFixed(2)),
            purchasetax: parseFloat(parseFloat(this.state.purchasetax).toFixed(2)),
            purchaseshipping: parseFloat(parseFloat(this.state.purchaseshipping).toFixed(2)),
            notes: this.state.notes
        }
        if (!this.state.purchaseshipping) {
            newItem.purchaseshipping = 0.00;
        }
        if (!this.state.purchasetax) {
            newItem.purchasetax = 0.00;
        }

        for (let i = 1; i <= this.state.quantity; i++) {
            console.log(newItem);
            this.addItemToInventory(newItem);
        }

        this.handleClose();
    };

    lookupID (e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ 
            productid: e.currentTarget.value
        } , () => {
            // console.log('New state in ASYNC callback: ', this.state.productid);
            const bearerToken: string | null = localStorage.getItem('tcgToken')
            fetch(`https://api.tcgplayer.com/v1.39.0/catalog/products/` + this.state.productid, {
                method: 'GET',
                headers: new Headers ({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + bearerToken,
                })
            })
            .then((response) => response.json())
            .then((productData) => {
                // console.log(productData)
                this.setState({ productname: productData.results[0].name})
            })
        });
        // console.log('New state DIRECTLY after setState: ', this.state.productid);
        // console.log(`https://api.tcgplayer.com/v1.39.0/catalog/products/` + this.state.productid)
        // console.log(productData)
        // this.setState({ productname: productData.results[0].name})
    }
 
    render() { 
        return (
            <div className="editModal-div">
            <Modal show={this.props.addModalOn} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Item to Inventory</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <FormLabel>TCG Product ID</FormLabel>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.lookupID(e)} required />
                        </div>
                        <div className="form-group">
                            <FormLabel>Product Name</FormLabel>
                            <input type="text" className="form-control" value={this.state.productname} placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ productname: e.currentTarget.value })} required />
                        </div>
                        <div className="form-group">
                            <FormLabel>Date Purchased</FormLabel>
                            <input type="date" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ datepurchased: e.currentTarget.value })} required />
                        </div>
                        <div className="form-group">
                            <FormLabel>Purchase Price</FormLabel>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ purchaseprice: e.currentTarget.value })} required />
                        </div>
                        <div className="form-group">
                            <FormLabel>Tax</FormLabel>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ purchasetax: e.currentTarget.value })} />
                        </div>
                        <div className="form-group">
                            <FormLabel>Shipping Cost</FormLabel>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ purchaseshipping: e.currentTarget.value })} />
                        </div>
                        <div className="form-group">
                            <FormLabel>Notes</FormLabel>
                            <input type="text" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ notes: e.currentTarget.value })} />
                        </div>
                        <div className="form-group">
                            <FormLabel>Quantity</FormLabel>
                            <input type="number" className="form-control" min="1" placeholder="1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ quantity: parseInt(e.currentTarget.value) })} />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                    <Button variant="primary" onClick={this.handleSubmit}>Add Item</Button>
                </Modal.Footer>
            </Modal>
        </div>
        );
    }
}
 
export default AddItem;