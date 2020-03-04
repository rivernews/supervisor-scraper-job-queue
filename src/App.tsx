import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ResumeJob } from "./pages/resume-job";

import styles from './App.module.css';

export default function App() {
  return (
    <Router>
      <div className={styles.App}>
        <h2>Navigation</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/resume-job">Resume Job</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/resume-job">
            <ResumeJob />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <>
    <h2>Home</h2>
    <p>
      This is the supervisor scraper frontend
    </p>
  </>;
}
