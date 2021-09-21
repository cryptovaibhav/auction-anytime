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
                            <p className="card-text font-weight-bold">{ props.item.name }</p>
                            <p className="card-text">{ props.item.desc }</p>
                            <div className="card-body">
                                <h1>Winner: </h1>
                                <h3 className="card-title pricing-card-title">{props.item.highestBidder}</h3>
                                <h1>Winning Bid: </h1>
                                <h3 className="card-title pricing-card-title">{props.item.highestBid} <small className="text-muted"> NEAR </small></h3>
                                <ul className="list-unstyled mt-3 mb-4">
                                    <li><b>Listed By: </b>{ props.item.owner }</li>
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