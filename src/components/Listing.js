import React from 'react';
import ListItem from "./ListItem";

function Listing(props) {
    return (
        <>
            <div className="page-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                <h1 className="display-4">Auction Anytime</h1>
                <p className="lead">Vote for your favorite items here. The highest voted item goes live on auction next once the timer runs out</p>
            </div>

            <div className="container">
                <div className="card-deck mb-3 row text-center">
                    {props.items.map((listItem) =>
                        <ListItem key = {listItem.id } 
                            item={listItem}
                            onClick={() => props.handleVoteClick(listItem)} />
                    )}
                </div>
            </div>
        </>
    );
}

export default Listing;