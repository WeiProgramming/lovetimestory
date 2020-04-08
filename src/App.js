import React from 'react';
import RecordScreen from './Components/Record';
import StoryScreen from './Components/Stories.js';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import kittysleep from './assets/images/sleeping-kitty.png'


function App() {
  return (
    <div className="App">
      <div className="image-container">
        <img src={kittysleep} className="img-fluid d-none d-md-block"/>  
      </div> 
      <Router>
        <Switch>
          <Route exact path="/">
            <StoryScreen />
          </Route>
          <Route exact path="/recording">
            <RecordScreen />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
