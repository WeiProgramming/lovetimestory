import React from 'react';
import RecordScreen from './Components/Record';
import StoryScreen from './Components/Stories.js';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
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
