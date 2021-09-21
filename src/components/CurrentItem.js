import React, { useState } from 'react';
import Loader from "./Loader";
import auctionService from '../services/auctionService';
import nearIcon from "../assets/logo-black.svg";

function CurrentItem(props) {
    const [showLoader, setShowLoader] = useState(false);
    const [showNotification, setShowNotification] = React.useState(false);
    const [transactionStatus, setTransactionStatus] = React.useState(true);
    const [message, setMessage] = React.useState("Added vote successfully");

    const handleSubmit = () => {
        setShowLoader(true);
        var bid = document.getElementById("bid").value;
        console.log("item is " + props.item.id + " and bid is " + bid);

        auctionService.bidForItem(props.item.id, bid, function(result){
            if(result){
                console.log("Bid added successfully");
                setShowLoader(false);
                setShowNotification(true);
                setCurrBid(bid);
                setHighestBidderLocal(window.accountId);

                setTimeout(() => {
                    setShowNotification(false);
                    props.handleNewBid();
                }, 5000);
            } else {
                console.log("adding bid failed. Please try again");
                setShowLoader(false);
                setTransactionStatus(false);
                setMessage("Adding Vote failed. Please try again");
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            }
        });
    };

    return (
        <>
            {props.item 
            ?   <div className="col-md-5 align-self-center">
                    { showLoader ? <Loader /> : 
                        <div className="card mb-4 box-shadow">
                            <img className="card-img-top img-border" src={ props.item.img } alt="Card image cap" />
                            <p className="card-text font-weight-bold">{ props.item.name }</p>
                            <p className="card-text">{ props.item.desc }</p>
                            <div className="card-body">
                                <h3>Current bid: </h3>
                                <h1 className="card-title pricing-card-title">{ props.item.highestBid } <small className="text-muted">NEAR</small></h1>
                                <ul className="list-unstyled mt-1 mb-2">
                                    <li><b>Minimum Bid: </b>{ props.item.minBid } NEAR</li>
                                    <li><b>Highest Bidder: </b>{ props.item.highestBidder }</li>
                                    <li><b>Owner: </b>{ props.item.owner } </li>
                                </ul>

                                <p>Place your bid (in NEAR): </p>
                                <div className="row item-row">
                                    <div className="col-2"></div>
                                    <div className="col-8 input-icon">
                                        <input type="text" id="bid" className="form-control" placeholder="0.0" />
                                        <img src={nearIcon}></img>
                                    </div>
                                    <div className="col-2"></div>
                                </div>

                                <button type="button" 
                                        className="btn btn-lg btn-outline-primary" 
                                        disabled={ props.item.owner == window.accountId } 
                                        onClick={handleSubmit}
                                        title={ props.item.owner == window.accountId ? "Cannot bid for your own item" : "Click to bid for this item"}
                                >Submit</button>
                            </div>
                        </div>
                    }
                </div>
             : <div className="col-md align-self-center">
                    <p>No item is currently undergoing auction. Please check back in some time. </p>
                </div>  
            }
            { showNotification && 
                            <Notification message = { message }
                                        success = { transactionStatus } /> }
        </>

    );
}

export default CurrentItem;