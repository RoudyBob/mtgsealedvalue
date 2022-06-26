import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

export interface ItemDisplayProps {

}

export interface ItemDisplayState {
    
}

class ItemDisplay extends React.Component<ItemDisplayProps, ItemDisplayState> {

    render() {
        return(
            <div className="item">
                <h1>Hello from ItemDisplay</h1>
            </div>
        )
    }

}

export default ItemDisplay;