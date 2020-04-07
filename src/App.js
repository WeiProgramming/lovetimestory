import React from 'react';
import RecordScreen from './Components/Record';
import StoryScreen from './Components/Stories.js';
import {
  BrowserRouter as Router,
  Switch,
  Route
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
