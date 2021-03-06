import React from "react";
import "./App.css";

import BenevolentBites from './pages/BenevolentBites';

import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
            <BenevolentBites />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;