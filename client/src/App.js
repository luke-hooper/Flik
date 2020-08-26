import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Redux
import { Provider } from "react-redux";
import store from "./store";

import "./App.css";

import PrivateRoute from "./components/routing/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import Tickets from "./components/tickets/Tickets";
import Ticket from "./components/tickets/Ticket";
import Projects from "./components/projects/Projects";
import Project from "./components/projects/Project";
import CreateTicket from "./components/forms/CreateTicket";
import UpdateTicket from "./components/forms/UpdateTicket";
import CreateProject from "./components/forms/CreateProject";
import UpdateProject from "./components/forms/UpdateProject";

import setAuthToken from "./util/setAuthToken";
import { loadUser } from "./actions/auth";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/tickets' component={Tickets} />
              <PrivateRoute exact path='/projects' component={Projects} />
              <PrivateRoute exact path='/ticket' component={Ticket} />
              <PrivateRoute exact path='/project' component={Project} />
              <PrivateRoute
                exact
                path='/create-ticket'
                component={CreateTicket}
              />
              <PrivateRoute
                exact
                path='/update-ticket'
                component={UpdateTicket}
              />
              <PrivateRoute
                exact
                path='/create-project'
                component={CreateProject}
              />
              <PrivateRoute
                exact
                path='/update-project'
                component={UpdateProject}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}
export default App;
