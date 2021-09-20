import React from 'react';

function NextItem(props) {
    return ( 
        
        <>
        { props.item
            ?   <div className="col-md align-self-center">
                    <div className="card mb-4 box-shadow opaque">
                        <h3 className="card-text">Next Item</h3>
                        <img className="card-img-top img-border" src={ props.item.img } alt="Card image cap" />
                        <p className="card-text">{ props.item.name }</p>
                        <p className="card-text">{ props.item.desc }</p>
                        <div className="card-body">
                            <h3>Current votes: </h3>
                            <h1 className="card-title pricing-card-title">{ props.item.currentVotes }</h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>Minimum Bid: { props.item.minBid }</li>
                                <li>Owner: { props.item.owner } </li>
                            </ul>
                        </div>
                    </div>  
                </div>  
            :   <div className="col-md align-self-center">
                    <p>No item found</p>
                </div> 
            }
    </>


    );
}

export default NextItem;