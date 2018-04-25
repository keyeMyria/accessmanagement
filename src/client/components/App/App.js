import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import SignInFormContainer from '../../containers/SignInFormContainer';
import LogoutPage from '../../components/Login/LogoutPage';
import QrCodeAuthentication from '../../components/Login/QrCodeAuthentication';
import Theme from './Theme';
import PropTypes from 'prop-types';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { Provider } from 'mobx-react';
import Attendies from '../AgentSpace/Attendies';
import AgentContainer from '../AgentSpace/AgentContainer';
import AdminContainer from '../AdminSpace/AdminContainer';
import decode from 'jwt-decode';
import AddUserFormContainer from '../../containers/AddUserFormContainer';
import QReaderComponent from '../AgentSpace/QReaderComponent';
import AttendiesList from '../AdminSpace/AttendiesList';
import ActivityHistory from '../AdminSpace/ActivityHistory';
import GuestListManageable from '../AdminSpace/GuestListManageable';
import PaginatedEntriesContainer from '../../containers/PaginatedEntriesContainer';
import AttendeeActivity from '../AdminSpace/AttendeeActivity';
import EventsList from '../AdminSpace/EventsList';
import EventDetail from '../AdminSpace/EventDetail';
import EventDashboard from '../AdminSpace/EventDashboard';
import VerifyEnterComponent from '../AgentSpace/VerifyEnterComponent';
import VerifyExitComponent from '../AgentSpace/VerifyExitComponent';
import EnterExitListUser from '../AgentSpace/EnterExitListUser';
import AgentList from '../AdminSpace/AgentList';
import AccessOperationForWorkshopsComponent from '../AgentSpace/AccessOperationForWorkshopsComponent';
import './style.css';
import { create } from 'jss';
import preset from 'jss-preset-default';
import rtl from 'jss-rtl';
import JssProvider from 'react-jss/lib/JssProvider';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import AgentDashboard from '../AgentSpace/AgentDashboard';
import SessionActivity from '../AdminSpace/SessionActivity';
import ListGuestBYSessionFilter from '../AdminSpace/ListGuestBYSessionFilter'
import UserStore from '../../mobx/gueststore'
import EventStore from '../../mobx/eventstore'
import SessionStore from '../../mobx/sessionstore'
// Configure JSS
const jss = create({ plugins: [...preset().plugins, rtl()] });
jss.options.createGenerateClassName = createGenerateClassName;

const theme = createMuiTheme();
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  //const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    //decode(refreshToken);
  } catch (err) {
    return false;
  }

  return true;
};
const isAdmin = () => {
  let role = localStorage.getItem('role');
  if (role == 'admin') return true;
  else {
    return false;
  }
};
const isINAgent = () => {
  let role = localStorage.getItem('role');
  if (role == 'agent_in') return true;
  else {
    return false;
  }
};
const isOUTAgent = () => {
  let role = localStorage.getItem('role');
  if (role == 'agent_out') return true;
  else {
    return false;
  }
};
const isWorkshopAgent = () => {
  let role = localStorage.getItem('role');
  if (role == 'agent_in_out') return true;
  else {
    return false;
  }
};
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin'
          }}
        />
      )
    }
  />
);
const AgentINRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() && isINAgent() ? (
        <AgentContainer>
          <Component {...props} />
        </AgentContainer>
      ) : (
        <Redirect
          to={{
            pathname: '/signout'
          }}
        />
      )
    }
  />
);
const AgentRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() &&
      (isINAgent() || isOUTAgent() || isWorkshopAgent()) ? (
        <AgentContainer>
          <Component {...props} />
        </AgentContainer>
      ) : (
        <Redirect
          to={{
            pathname: '/signout'
          }}
        />
      )
    }
  />
);
//
const AgentWorkshopRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() && isWorkshopAgent() ? (
        <AgentContainer>
          <Component {...props} />
        </AgentContainer>
      ) : (
        <Redirect
          to={{
            pathname: '/signout'
          }}
        />
      )
    }
  />
);
const AgentOUTRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() && isOUTAgent() ? (
        <AgentContainer>
          <Component {...props} />
        </AgentContainer>
      ) : (
        <Redirect
          to={{
            pathname: '/signout'
          }}
        />
      )
    }
  />
);
const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() && isAdmin() ? (
        <AdminContainer>
          <Component UserStore={UserStore} {...props} />
        </AdminContainer>
      ) : (
        <Redirect
          to={{
            pathname: '/signout'
          }}
        />
      )
    }
  />
);
const CommonAuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() &&
      (isAdmin() || (isINAgent() || isOUTAgent() || isWorkshopAgent())) ? (
        <AdminContainer>
          <Component UserStore={UserStore} {...props} />
        </AdminContainer>
      ) : (
        <Redirect
          to={{
            pathname: '/signout'
          }}
        />
      )
    }
  />
);
const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signout'
          }}
        />
      )
    }
  />
);
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={Theme}>
          <Provider
            UserStore={UserStore}
            EventStore={EventStore}
            SessionStore={SessionStore}>
            <JssProvider jss={jss}>
              <Switch>
                <LoginRoute exact path="/" component={SignInFormContainer} />
                <LoginRoute
                  exact
                  path="/loggedas/:uid"
                  component={SignInFormContainer}
                />
                <Route exact path="/signout" component={LogoutPage} />
                <PrivateRoute
                  exact
                  path="/capture"
                  component={QReaderComponent}
                />
                <AgentRoute exact path="/listattendies" component={Attendies} />
                <AgentRoute exact path="/agent" component={QReaderComponent} />
                <AgentRoute
                  exact
                  path="/dashboard"
                  component={AgentDashboard}
                />
                <AgentRoute
                  exact
                  path="/operateonguestlist"
                  component={EnterExitListUser}
                />
                <AdminRoute
                  exact
                  path="/manageguest"
                  component={GuestListManageable}
                />
                <AdminRoute
                  exact
                  path="/listguests"
                  component={AttendiesList}
                />
                <AdminRoute
                  exact
                  path="/activitylog"
                  component={PaginatedEntriesContainer}
                />
                <CommonAuthenticatedRoute
                  exact
                  path="/listusersbysession/:id"
                  component={ListGuestBYSessionFilter}
                />
                <AdminRoute
                  exact
                  path="/adduser"
                  component={AddUserFormContainer}
                />
                <AdminRoute
                  exact
                  path="/useractivity/:id"
                  component={AttendeeActivity}
                />
                <CommonAuthenticatedRoute
                  exact
                  path="/sessionactivity/:id"
                  component={SessionActivity}
                />
                <AdminRoute exact path="/manageagents" component={AgentList} />
                <AdminRoute exact path="/managevents" component={EventsList} />
                <AdminRoute
                  exact
                  path="/manage-single-event/:id"
                  name="event-detail"
                  component={EventDetail}
                />
                <AdminRoute
                  exact
                  path="/event-dashboard/:id"
                  name="event-detail"
                  component={EventDashboard}
                />
                <AgentINRoute
                  exact
                  path="/verifyenter/:id"
                  component={VerifyEnterComponent}
                />
                <AgentOUTRoute
                  exact
                  path="/verifyexit/:id"
                  component={VerifyExitComponent}
                />
                <AgentWorkshopRoute
                  exact
                  path="/accessoperation/:id"
                  component={AccessOperationForWorkshopsComponent}
                />
              </Switch>
            </JssProvider>
          </Provider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

export default App;
