import React from 'react';
import CurrentItem from "./CurrentItem.js";
import PreviousItem from "./PreviousItem.js";
import NextItem from './NextItem';

function Home (props){
    return (
        <div>
            <div className="page-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                <h3>Hi, {window.accountId}</h3>
                <h1 className="display-4">Welcome to Auction Anytime</h1>
                <p className="lead">We are a community driven 24 * 7 * 365 auction platform where you can list your items, browse existing items, vote for your favorite items and participate in the always live auctions. It was powered by NEAR blockchain.</p>
            </div>
  
            <div className="container">
                <div className="card-deck mb-3 row text-center">
                <PreviousItem 
                    item = { props.lastSoldItem }/>
                <CurrentItem 
                    item = { props.currentItem }/>
                <NextItem 
                    item = { props.nextItem }/>
                </div>
            </div>
        </div>
    );
}

export default Home;