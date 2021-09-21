import { utils } from 'near-api-js';
const DEFAULT_GAS = 300000000000000;
import placeholder from "../assets/placeholder.jpeg";
import cronService from './cronService';

function getAllItems(itemState, callback){
    window.contract.get_all_items({ state: itemState })
        .then(items => {
            console.log(items);
            var mappedItems = [];
            items.forEach(item => {
                var mappedItem = {
                    id: item.id, 
                    name: item.name, 
                    desc: item.description, 
                    currentVotes: item.current_votes, 
                    img: item.image_url ? item.image_url : placeholder, 
                    isHighestVoted: false, 
                    state: parseInt(item.state), 
                    minBid: item.starting_bid == '0' ? item.starting_bid : utils.format.formatNearAmount(item.starting_bid), 
                    highestBid: item.highest_bid == '0' ? item.highest_bid : utils.format.formatNearAmount(item.highest_bid), 
                    highestBidder: item.highest_bidder,
                    owner: item.owner,
                    voters: item.voters
                };
                mappedItems.push(mappedItem);
            });
            return callback(mappedItems); 
        })
        .catch(ex => {
            console.log("getting items failed");
            throw ex;
        });
}

function voteForItem(itemId, callback){
    window.contract.vote_for_item({ item_id: itemId })
        .then(result => {
            result ? console.log("success") : console.log("failed");
            callback(result);
        })
        .catch(ex => {
            console.log("Voting item failed");
            throw ex;
        });
}

function bidForItem(itemId, bid, callback){
    const bidInYocto = utils.format.parseNearAmount(bid);
    window.contract.add_bid({ item_id: itemId }, DEFAULT_GAS, bidInYocto)
        .then(result => {
            result ? console.log("success") : console.log("failed");
            callback(result);
        })
        .catch(ex => {
            console.log("Item add failed");
            throw ex;
        });
}

function listItem(name, desc, minBid, imageURL, callback){
    window.contract.list_item({ name: name, desc: desc, min_bid: minBid, image_url: imageURL })
        .then(itemId => {
            console.log("Item listed successfully: " + itemId);
            return callback(itemId);
        })
        .catch(ex => {
            console.log("Item add failed");
            callback(0);
            throw ex;
        });
}

function startAuction(callback){
    cronService.scheduleCronJob(callback);

    // window.contract.start_auction({})
    //     .then(result => {
    //         result ? console.log("success") : console.log("failed");
    //         return result;
    //     })
    //     .catch(ex => {
    //         console.log("Item add failed");
    //         throw ex;
    //     });
}

function getJobStatus(callback){
    cronService.getJobStatus(callback);
}

export default {
    getAllItems: getAllItems, 
    voteForItem: voteForItem, 
    bidForItem: bidForItem, 
    listItem: listItem,
    startAuction: startAuction,
    getJobStatus: getJobStatus
}