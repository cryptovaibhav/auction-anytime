import '../styles/App.css';
import "../vendor/bootstrap.min.css";
import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import Home from "./Home";
import Listing from './Listing';
import AddItem from './AddItem';
import { logout } from '../utils';
import auctionService from '../services/auctionService';
import { ItemStateEnum } from "../utils";

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayItems: []
    };
  }

  componentDidMount() {
    console.log("component did mount is called");
    if (window.walletConnection.isSignedIn()) {
      this.updateStateWithLatestItems();
    }
  }

  componentDidUpdate() {
    console.log("component did update is called");
  }

  updateStateWithLatestItems(){
    auctionService.getAllItems(ItemStateEnum.All, (items) => {
      if(items.length > 0){
        console.log(items.length + " items found");
        console.log("computing highest voted item");

        //update highest voted Item
        var highestVotes = -1;
        var highestVotedItem = null;
        items.forEach(item => {
            if(item.state != ItemStateEnum.Auction && item.state != ItemStateEnum.Sold){
              if(item.currentVotes > highestVotes){
                highestVotedItem = item;
                highestVotes = item.currentVotes;
              }
            }
        });

        if(highestVotedItem){
          var finalList = items.map(item => {
            return item.id == highestVotedItem.id ? {...item, isHighestVoted: true} : item;
          });
          finalList = finalList.sort(function(a,b){
            return a.currentVotes < b.currentVotes ? 1 : -1;
          });
          this.setState({displayItems: finalList});
        } else {
          this.setState({displayItems: items});
        }
      }
    });
  }

  onAddItemClick(newItem){
    console.log("getting latest items list");
    this.updateStateWithLatestItems();
  }

  getHomePageItems(){
    var currentItem = this.state.displayItems.filter(item => item.state == ItemStateEnum.Auction)[0];
    var previousItem = this.state.displayItems.filter(item => item.state == ItemStateEnum.Sold).at(-1);
    var nextItem = this.state.displayItems.filter(item => item.isHighestVoted)[0];

    var items = [previousItem, currentItem, nextItem];
    return items;
  }

  getVotingItems(){
    var items = this.state.displayItems.filter(item => item.state != ItemStateEnum.Auction && item.state != ItemStateEnum.Sold);
    return items;
  }

  addVoteClick(listItem) {
      console.log("Add vote clicked from: " + listItem.id);
      this.updateStateWithLatestItems();
  };

  getUserListings(){
    return this.state.displayItems.filter(item => item.owner == window.accountId );
  };

  submitBid(item, bid){
    console.log("Add bid clicked for: " + item.id);
    this.updateStateWithLatestItems();
  }

  render(){
    const homePageItems = this.getHomePageItems();
    console.log(process.env.PUBLIC_URL);
    return (
        <Router basename={process.env.PUBLIC_URL}>
          <div className="App">

            <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
              <h5 className="my-0 mr-md-auto font-weight-normal">Auction Anytime, All the time</h5>
              <nav className="my-2 my-md-0 mr-md-3">
                  <NavLink to="/" name="home" className="p-2 text-dark" exact activeClassName="selected-menu">Home</NavLink>
                  <NavLink to="/listings" name="listings" className="p-2 text-dark" exact activeClassName="selected-menu">All Listings</NavLink>
                  <NavLink to="/myListings" name="myListings" className="p-2 text-dark" exact activeClassName="selected-menu">My Listings</NavLink>
                  <NavLink to="/addItem" name="addItem" className="p-2 text-dark" exact activeClassName="selected-menu">Add Item</NavLink>
              </nav>
              <a className="btn btn-outline-primary" href="#" onClick={ logout }>Sign Out</a>
            </div>

            <Switch>
              <Route path="/listings">
                <Listing items= { this.getVotingItems() }
                    handleVoteClick={(i) => this.addVoteClick(i)}/>
              </Route>
              <Route path="/myListings">
                <Listing items={this.getUserListings()}/>
              </Route>
              <Route path="/addItem">
                <AddItem onAddItemClick={(i) => this.onAddItemClick(i)}/>
              </Route>
              <Route path="/">
                { homePageItems.length >=3 && 
                <Home lastSoldItem = { homePageItems[0] }
                  currentItem = { homePageItems[1] }
                  nextItem = { homePageItems[2] } 
                  handleNewBid={(i, j) => this.submitBid(i,j)}/> }
              </Route>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default Main;
