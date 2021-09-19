import {
  context,
  logging,
  PersistentMap,
  PersistentVector,
  u128,
  RNG,
  ContractPromiseBatch
} from "near-sdk-as";

const enum ItemState {
  Listed,
  Auction,
  Sold,
  None
};

@nearBindgen
export class AuctionItem {
  id: u32;
  name: string;
  description: string;
  image_url: string;
  starting_bid: u128;
  highest_bid: u128;
  highest_bidder: string;
  current_votes: u32;
  owner: string;
  voters: Array<string>;
  state: ItemState;

  constructor() {
    const rng = new RNG<u32>(1, u32.MAX_VALUE);
    this.id = rng.next();
    this.highest_bid = u128.Zero;
    this.current_votes = 0;
    this.highest_bidder = "None";
    this.owner = "None";
    this.state = ItemState.Listed;
    this.voters = [];
  }
}

const itemsMap = new PersistentMap<u32, AuctionItem>("a");
const itemsVector = new PersistentVector<u32>("b");

export function list_item(name: string, desc: string, min_bid: u128, image_url: string): u32 {
  const item = new AuctionItem();
  item.name = name;
  item.description = desc;
  item.image_url = image_url;
  item.starting_bid = min_bid;
  item.owner = context.sender;

  itemsMap.set(item.id, item);
  itemsVector.push(item.id);
  logging.log("item listed successfully: " + item.id.toString());

  return item.id;
}

export function get_all_items(state: ItemState): Array<AuctionItem> {
  const itemsArray = new Array<AuctionItem>();

  for (let index = 0; index < itemsVector.length; index++) {
    const item = itemsMap.getSome(itemsVector[index]);
    if (state == ItemState.None || item.state == state) {
      logging.log(item);
      itemsArray.push(item);
    }
  }

  return itemsArray;
}

export function vote_for_item(item_id: u32): bool {
  const voter = context.sender;
  const item = itemsMap.getSome(item_id);

  if (item.state != ItemState.Listed) {
    logging.log("Item is already under auction or sold");
    return false;
  } else if (item.voters.includes(voter)) {
    logging.log("One person can vote only once");
    return false;
  }

  item.current_votes += 1;
  item.voters.push(voter);
  itemsMap.set(item_id, item);

  return true;
}

export function add_bid(item_id: u32): bool {
  logging.log("attached deposit is: " + context.attachedDeposit.toString());
  const bid = context.attachedDeposit;
  const bidder = context.sender;
  const item = itemsMap.getSome(item_id);

  if (item.state != ItemState.Auction) {
    logging.log("Can't bid on an item which is not in auction");
    revert_payment(bidder, context.attachedDeposit);
    return false;
  }
  if (bid <= item.highest_bid) {
    logging.log("Need to bid higher than current highest bid of : " + item.highest_bid.toString());
    logging.log("reverting transaction. Transferring " + bid.toString() + " back to owner");
    revert_payment(bidder, bid);
    return false;
  }
  if(bid <= item.starting_bid){
    logging.log("Need to bid higher than minimum bid of : " + item.starting_bid.toString());
    logging.log("reverting transaction. Transferring " + bid.toString() + " back to owner");
    revert_payment(bidder, bid);
    return false;
  }
  item.highest_bid = bid;
  item.highest_bidder = bidder;

  itemsMap.set(item_id, item);
  return true;
}

// will get called once auction time is over
export function start_auction(): bool {
  //end the previous auction
  const auctioned_items = get_all_items(ItemState.Auction);
  if (auctioned_items.length > 0) {
    transfer_ownership(auctioned_items[0].id);
  } else {
    logging.log("No items under auction currently");
  }

  //find the highest voted item
  const items = get_all_items(ItemState.Listed);
  var highest_voted_item = items[0];

  for (let i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.current_votes > highest_voted_item.current_votes) {
      highest_voted_item = item;
    }
  }

  highest_voted_item.state = ItemState.Auction;
  itemsMap.set(highest_voted_item.id, highest_voted_item);

  logging.log("highest voted item is: " + highest_voted_item.id.toString());
  return true;
}

// will get called once auction time is over
function transfer_ownership(item_id: u32): bool {
  const item = itemsMap.getSome(item_id);
  if (item.state != ItemState.Auction) {
    logging.log("Can't do it for an item which is not in Auction");
    return false;
  }

  item.state = ItemState.Sold;
  item.owner = item.highest_bidder;
  itemsMap.set(item.id, item);
  const to_owner = ContractPromiseBatch.create(item.owner);
  to_owner.transfer(item.highest_bid);

  return true;
}

function revert_payment(sender: string, amount: u128): void{
  logging.log("transferring tokens: " + amount.toString());
  const to_owner = ContractPromiseBatch.create(sender);
  to_owner.transfer(amount);
}

export function delete_item(item_id: u32): bool {
  itemsMap.delete(item_id);
  itemsVector.pop();
  return true;
}