import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Circle from './Circle.js'

class App extends Component {
  constructor() {
    super();

    //Init state
    this.state = {
      loaded: false,
      top: []
    }

    //Bind refresh for click event
    this.refresh = this.refresh.bind(this);
  }

  getPage(after) {
    //Fetch a page of 100 posts after `after`
    return fetch("https://api.reddit.com/r/CircleofTrust/top/?t=all&&limit=100" + (after ? `&&after=${after}` : "")).then(res => res.json());
  }

  updateListings(page) {
    //Filter out listings that are not circles (announcment posts)
    var circles = page.data.children.filter(listing => !listing.data.is_self);
    //Map listings to app circle format
    var top = circles.map(function(circle) {
        return {id: circle.data.name, name: circle.data.title, score: circle.data.score, link: circle.data.permalink, betrayed: circle.data.link_flair_css_class === "post-betrayed"};
    });
    //Add all previous circles in state
    top = top.concat(this.state.top);
    //Sort circles by score
    top.sort( (a,b) => (b.score - a.score) );    
    //Update state
    this.setState({top});
  }

  async refresh() {
    //Clear state. '/r/CenturyClub' is hardcoded because it doesn't show up on /top.
    this.setState({ loaded: false, top: [{betrayed: true, id: "t3_890tfp", link: "/r/CircleofTrust/comments/890tfp/rcenturyclub/", name: "/r/CenturyClub", score: 181}] });

    var after = null;
    //Fetch 4 pages
    for(var i = 0; i < 4; i++) {
      var page = await this.getPage(after);
      this.updateListings(page);
      after = page.data.after;
    }

    //Update state
    this.setState({ loaded: true })
  }

  componentDidMount() {
    //Refresh on load
    this.refresh();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" onClick={this.refresh}/>
          <h1 className="App-title">Circle Of Trust</h1>
          <p className="App-owner-text">by /u/michael________</p>
        </header>
        { !this.state.loaded && <div className="App-loading"></div> }
        <div className="App-content">
          <div className="App-active">
            <h2>Top Active Circles</h2>
            <div>
              {
                //Filter to only active circles.
                this.state.top.filter(listing => !listing.betrayed).slice(0,15).map( (circle) => 
                  <Circle circle={circle} key={circle.id}/>
                )
              }
            </div>
          </div>
          <div className="App-all">
            <h2>Top Circles (All Time)</h2>
            <div>
              {
                this.state.top.slice(0,15).map( (circle) => 
                  <Circle circle={circle} key={circle.id}/>
                )
              }
            </div>
          </div>
          <div className="App-betrayed">
            <h2>Top Betrayed Circles</h2>
            <div>
              {
                //Filter to only betrayed circles.
                this.state.top.filter(listing => listing.betrayed).slice(0,15).map( (circle) => 
                  <Circle circle={circle} key={circle.id}/>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
