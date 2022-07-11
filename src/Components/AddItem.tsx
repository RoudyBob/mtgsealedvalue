import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface AddItemProps {
    addModalOn: boolean,
    toggleAddModal: Function
}
 
interface AddItemState {
    
}

class AddItem extends React.Component<AddItemProps, AddItemState> {
    constructor(props: AddItemProps) {
        super(props);
        this.state = {};
    }


    handleClose = () => {
        this.props.toggleAddModal();
    }
 
    render() { 
        return (
            <div className="editModal-div">
            <Modal show={this.props.addModalOn} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        );
    }
}
 
export default AddItem;