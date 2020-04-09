import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ResumeJob } from "./pages/resume-job";

import styles from './App.module.css';
import { Home } from "./pages/home";
import { LoginPage } from "./pages/login";
import { ControlPanelPage } from "./pages/control-panel.page";
import { Authenticator } from "./services/authenticate";
import { apiService } from "./services/apiService";

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
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/resume-job">Resume Job</Link>
            </li>
            <li>
              <Link to="/control-panel">Control Panel</Link>
            </li>
            <li>
              <a href={`${process.env.NODE_ENV === 'production' ?
                apiService.PRODUCTION_API_SERVER_BASE_URL :
                apiService.developmentApiServerBaseUrl}/dashboard?token=${Authenticator.token}`}>Job Queue Dashboard</a>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/resume-job">
            <ResumeJob />
          </Route>
          <Route path="/control-panel">
            <ControlPanelPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


