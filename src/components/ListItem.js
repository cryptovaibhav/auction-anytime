import React, {useState} from 'react';
import Loader from './Loader';
import auctionService from '../services/auctionService';
import Notification from './Notification';

function ListItem(props){
    const [showLoader, setShowLoader] = useState(false);
    const [showNotification, setShowNotification] = React.useState(false);
    const [transactionStatus, setTransactionStatus] = React.useState(true);
    const [message, setMessage] = React.useState("Added vote successfully");
    const [votes, setVotes] = React.useState(props.item.currentVotes);

    const handleSubmit = () => {
        setShowLoader(true);
        
        auctionService.voteForItem(props.item.id, function(result){
            if(result){
                console.log("Vote added successfully");
                setShowNotification(true);
                setShowLoader(false);
                setVotes( votes + 1 );

                setTimeout(() => {
                    setShowNotification(false);
                    props.onClick();
                }, 5000);
            } else {
                console.log("adding vote failed. Please try again");
                setShowLoader(false);
                setTransactionStatus(false);
                setMessage("Adding Vote failed. Please try again");
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            }
        });
    }

    return (
        <>
            <div className="col-md-4">
                { showLoader ? <Loader /> : 
                    <div className="card mb-4 box-shadow">
                        { props.item.isHighestVoted && <h3 className="card-text">Highest Voted Item</h3> }
                        <img className="card-img-top img-border list-image" src={ props.item.img } alt="Card image cap" />
                        <p className="card-text">{ props.item.name }</p>
                        <p className="card-text">{ props.item.desc }</p>
                        <div className="card-body">
                            <h3>Current votes: </h3>
                            <h1 className="card-title pricing-card-title">{ votes }</h1>
                            <ul className="list-unstyled mt-1 mb-1">
                                <li>Minimum Bid: { props.item.minBid } NEAR</li>
                                <li>Owner: { props.item.owner } </li>
                                { props.item.state != "" && <li>State: { props.item.state }</li>}
                            </ul>
                        </div>
                        <button type="button" className="btn btn-lg btn-outline-primary" onClick={ handleSubmit }>Vote now</button>
                    </div>  
                }
            </div>
            { showNotification && 
                        <Notification message = { message }
                                    success = { transactionStatus } /> }
        </>
        
    );
}

export default ListItem;