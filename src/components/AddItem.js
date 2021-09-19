import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import nearIcon from "../assets/logo-black.svg";
import auctionService from "../services/auctionService";
import Notification from "./Notification";
import Loader from "./Loader";
import { utils } from 'near-api-js';

function AddItem(props){
    const [showLoader, setShowLoader] = useState(false);
    const [showNotification, setShowNotification] = React.useState(false);
    const [transactionStatus, setTransactionStatus] = React.useState(true);
    const [message, setMessage] = React.useState("Added item successfully. Redirecting to listings page...");
    const history = useHistory();

    const handleSubmit = (evt) => {
        setShowLoader(true);
        evt.preventDefault();
        var item = {
            name: document.getElementsByName("name")[0].value,
            desc: document.getElementsByName("desc")[0].value,
            minBid: document.getElementsByName("minBid")[0].value,
            imageURL: document.getElementsByName("imageURL")[0].value
        };
        
        item.minBid = utils.format.parseNearAmount(item.minBid);
        console.log(item.minBid);
        auctionService.listItem(item.name, item.desc, item.minBid, item.imageURL, function(itemId){
            if(itemId != 0){
                console.log("item added successfully: " + itemId);
                setShowLoader(false);
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                    props.onAddItemClick(item);
                    history.push("/myListings");
                }, 11000);
            } else {
                console.log("Add failed. Try again!!");
                setShowLoader(false);
                setTransactionStatus(false);
                setMessage("Adding item failed. Please try again");
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            }
        });
    }

    return (
        <>
            { showLoader ? <Loader /> : <AddItemForm handleSubmit={handleSubmit}/> }
            { showNotification && 
                    <Notification message = { message }
                                success = { transactionStatus } /> }
        </>
    );
}

const AddItemForm = (props) => {
    return (
        <form className="add-item-form" onSubmit={props.handleSubmit}>
            <div className="form-row">                
                <div className="form-group col-md-6">
                        <label htmlFor="inputPassword4">Name</label>
                        <input type="text" name="name" className="form-control" id="itemName" placeholder="Item Name" />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">Minimum Bid(in NEAR)</label>
                    <div className="input-icon">
                        <input type="text" name="minBid" className="form-control" placeholder="0.0" />
                        <img src={ nearIcon }></img>
                    </div>
                </div>
            </div>

            <div className="form-row">                
                <div className="form-group col-md-8">
                        <label htmlFor="inputEmail4">Image URL</label>
                        <input type="text" name="imageURL" className="form-control" id="inputOwner" placeholder="Image URL" />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="inputEmail4">Owner</label>
                    <input type="text" name="owner" value={window.accountId} className="form-control-plaintext owner-id" id="inputOwner" placeholder="Owner" readOnly/>
                </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Description</label>
                <textarea name="desc" className="form-control" id="itemDesc" rows="3"></textarea>
            </div>
            <button type="submit" id="submitButton" value="Submit" className="btn btn-outline-primary">Submit</button>
        </form>
    );
}

export default AddItem;