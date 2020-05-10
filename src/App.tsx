import React, { useState } from "react";
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
import { apiService } from "./services/apiService";
import { NodeScalingPage } from "./pages/node-scaling.page";
import { AuthCredentials } from "./types/auth.types";
import { AppContext } from "./services/appService";
import { Authenticator } from "./services/authenticate";



export default function App() {
  const [authCredentials, setAuthCredentials] = useState<AuthCredentials>({
    token: Authenticator.token,
    port: Authenticator.port
  });

  return (
    <AppContext.Provider value={{ authCredentials, setAuthCredentials }} >
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
                <Link to="/k8s">Node scaling</Link>
              </li>
              <li>
                <Link to="/resume-job">Resume Job</Link>
              </li>
              <li>
                <Link to="/control-panel">Job Control Panel</Link>
              </li>
              <li>
                <a href={`${process.env.NODE_ENV === 'production' ?
                  apiService.PRODUCTION_API_SERVER_BASE_URL :
                  apiService.developmentApiServerBaseUrl}:${authCredentials.port}/dashboard?token=${authCredentials.token}`}>Bull Job Queue Dashboard</a>
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
            <Route path="/k8s">
              <NodeScalingPage />
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
    </AppContext.Provider>
  );
}

