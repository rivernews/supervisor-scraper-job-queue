import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ResumeJob } from "./pages/resume-job";
import { TabBar, Tab } from "@rmwc/tabs";
import '@rmwc/tabs/styles';
import { RMWCProvider } from '@rmwc/provider';

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

  const routes = [{
    to: '/', text: 'Home', icon: 'home'
  }, {
    to: '/login', text: 'Login', icon: 'account_circle'
  }, {
    to: '/k8s', text: 'Node Scaling', icon: 'cloud_upload'
  }, {
    to: '/resume-job', text: 'Create Job', icon: 'assignment'
  }, {
    to: '/control-panel', text: 'Queue Control', icon: 'build'
  }, {
    href: `${process.env.NODE_ENV === 'production' ?
      apiService.PRODUCTION_API_SERVER_BASE_URL :
      `${apiService.developmentApiServerBaseUrl}:${authCredentials.port}`}/dashboard?token=${authCredentials.token}`, text: 'Dashboard',
    target: '_blank',
    icon: 'open_in_new'
  }]

  return (
    <RMWCProvider>
      <AppContext.Provider value={{ authCredentials, setAuthCredentials }} >
        <Router>
          <div className={styles.App}>
            <nav>
              <TabBar>
                {routes.map((r, i) => {
                  return (
                    <Tab key={i} tag={Link} to={r.href ? { pathname: r.href } : r.to}
                      target={r.target}
                      icon={r.icon}
                      stacked
                    >{r.text}</Tab>
                  )
                })}
              </TabBar>
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
    </RMWCProvider>
  );
}

