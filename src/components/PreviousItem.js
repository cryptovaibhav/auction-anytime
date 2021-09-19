import React from 'react';
import sold from "../assets/sold.png";

function PreviousItem(props) {
    return (
        <>
            { props.item
                ?   <div className="col-md align-self-center">
                        <div className="card mb-4 box-shadow opaque">
                            <h3 className="card-text">Last Sold Item</h3>
                            <img className="card-img-top img-border previous-image" src={ props.item.img } alt="Card image cap" />
                            <img className="card-img-top overlay" src={ sold } alt="Card image cap" />
                            <p className="card-text">{ props.item.name }</p>
                            <p className="card-text">{ props.item.desc }</p>
                            <div className="card-body">
                                <h1>Winning Bid: </h1>
                                <h1 className="card-title pricing-card-title">{props.item.highestBid} <small className="text-muted"> NEAR </small></h1>
                                <ul className="list-unstyled mt-3 mb-4">
                                    <li>Minimum Bid: { props.item.minBid }</li>
                                    <li>Winner: { props.item.highestBidder }</li>
                                </ul>
                            </div>
                        </div>  
                    </div> 
                :   <div className="col-md align-self-center">
                        <p>No item sold so far</p>
                    </div>  
                }
        </>
    );
}

export default PreviousItem;