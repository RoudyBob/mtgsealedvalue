import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface EditItemProps {
    toggleEditModal: Function,
    editModalOn: boolean,
    inventoryId: number,
}
 
interface EditItemState {

}
 
class EditItem extends React.Component<EditItemProps, EditItemState> {
    constructor(props: EditItemProps) {
        super(props);
        this.state = {};
    }

    handleClose = () => {
        this.props.toggleEditModal();
    }
    render() { 
        return (
            <div className="editModal-div">
                <Modal show={this.props.editModalOn} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal! Inventory ID {this.props.inventoryId}</Modal.Body>
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
 
export default EditItem;