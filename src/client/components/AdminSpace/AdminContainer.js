import React from 'react';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import PersonAdd from 'material-ui-icons/PersonAdd';
import GroupWork from 'material-ui-icons/GroupWork';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import AssignmentInd from 'material-ui-icons/AssignmentInd';
import Lock from 'material-ui-icons/Lock';
import {Link} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

import NavBarContainer from '../../containers/NavBarContainer';
import BottomToolbarContainer from '../../containers/BottomToolbarContainer';
import Directions from 'material-ui-icons/Directions';
import SupervisorAccount from 'material-ui-icons/SupervisorAccount'
import ExitToApp from 'material-ui-icons/ExitToApp'
import Event from 'material-ui-icons/Event'
const drawerWidth = 240 ;
const container = {
    overflow: 'auto',
    marginBottom: '56px',
    marginTop : '56px'
};

class AdminContainer extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      drawer_open :false ,
      start_session :false ,
      end_session : false ,
      addEventItems : false,
      eventid : null
    }
  }

  handleDialogOpen = () => {
    this.setState({ start_session: true });
  };
  handleSnackBarClosing =(val)=>{
    this.setState({ open_snackbar: val });
  }
  openSnackBarControl=(msg)=>{

  }
  handleEndDialogOpen = () => {
      this.setState({ end_session: true });
    };
  handleSessionCreation =()=>{
    this.props.createSessionMutation()
      .then((response) => {
        this.setState({ start_session: false , open_snackbar:true });
        this.openSnackBarControl("Session created successfully" )
      })
    .catch((err) => {
      console.error(err);
    });
}
handleSessionCancellation =()=>{
  this.props.stopSessionMutation()
    .then((response) => {
      this.setState({ end_session: false , open_snackbar:true });
      this.openSnackBarControl("Session stopped successfully")

    })
    .catch((err) => {
      console.error(err);
    });
  }
handleEventDashboardBottomBarElements=(id)=>{
  this.setState({
    addEventItems : true ,
    eventid : id
  })
}
cancelEventDashboardBottomBarElements=()=>{
  this.setState({
    addEventItems : false ,
    eventid : null
  })
}
  handleDialogClose = () => {
    this.setState({ start_session: false });
  };
  handleEndDialogClose = () => {
    this.setState({ end_session: false });
  };
  handleDrawerOpen = () =>{
       this.setState({ drawer_open: true });
  }
  handleDrawerClose=()=>{
    this.setState({ drawer_open: false });

};
  redirectToEffect=(event)=>{
    this.cancelEventDashboardBottomBarElements()
    this.handleDrawerClose()
  }
  render(){
    const childrenWithExtraProp = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        handleEventDashboardBottomBarElements: this.handleEventDashboardBottomBarElements
      });
    });
    const drawer = (
      <Drawer
         anchor="left"
         open={this.state.drawer_open}
         onClose={this.handleDrawerClose}

      >
        <div>
          <div>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />

          <Link to="/managevents" style={{ textDecoration: 'none' }} onClick={this.redirectToEffect}>
            <ListItem button>
              <ListItemIcon  color="secondary">
                <Event />
              </ListItemIcon>
              <ListItemText primary="ادارة الاحداث" />
            </ListItem>
          </Link>

          <Link to="/manageagents" style={{ textDecoration: 'none' }} onClick={this.redirectToEffect}>
            <ListItem button>
              <ListItemIcon color="secondary">
                <VerifiedUser/>
              </ListItemIcon>
              <ListItemText primary="تعيين الوكلاء" />
            </ListItem>
          </Link>

          <Link to="/manageguest" style={{ textDecoration: 'none' }} onClick={this.redirectToEffect}>
            <ListItem button>
              <ListItemIcon  color="secondary">
               <AssignmentInd />
              </ListItemIcon>
              <ListItemText primary="ادارة الحضور" />
            </ListItem>
          </Link>

          <Link to="/adduser" style={{ textDecoration: 'none' }} onClick={this.redirectToEffect}>
            <ListItem button>
              <ListItemIcon  color="secondary">
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="إضافة مستخدم" />
            </ListItem>
          </Link>

            <Link to="/signout" style={{ textDecoration: 'none' }}>
              <ListItem button>
                <ListItemIcon  color="secondary">
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="الخروج" />
              </ListItem>
            </Link>

        </div>
      </Drawer>

    );
    return (
        <div  style={container}>
              <NavBarContainer
                handleDrawerOpen = {this.handleDrawerOpen}
              />
              <Dialog open={this.state.start_session} onRequestClose={this.handleDialogClose}>
              <DialogTitle>{"Confirm starting a new session"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure that you want to start a new Session ...Creating a new session will automatically stop any other opened sessions
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleSessionCreation} color="primary">
                  Yes I''m sure
                </Button>
                <Button onClick={this.handleDialogClose} color="primary" autoFocus>
                  Discard
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={this.state.end_session} onRequestClose={this.handleEndDialogClose}>
                  <DialogTitle>{"Confirm Ending the current session"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure that you want to stop the current Session ...This operation will automatically exit all attendies
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleSessionCancellation} color="primary">
                      Yes I''m sure
                    </Button>
                    <Button onClick={this.handleEndDialogClose} color="primary" autoFocus>
                      Discard
                    </Button>
                  </DialogActions>
                </Dialog>
          {drawer}
          {childrenWithExtraProp}

          <BottomToolbarContainer addEventItems={this.state.addEventItems} eventid={this.state.eventid}/>
        </div>
  );

  }
}
const createSessionMutation = gql`
  mutation createSession{
    createSession {
      _id
      start_hour
    }
  }
`;
const stopSessionMutation = gql`
  mutation stopSessionMutation{
    closeSession {
      _id
      start_hour
    }
  }
`;
const activeSession = gql`
  query activeSession{
    activeSession {
      _id
      start_hour
    }
  }
`;
///const contwithquery = graphql(getactiveSession)(AdminContainer);
const AdminContainerWithMutation = compose(
graphql(activeSession),
 graphql(createSessionMutation, {
   name : 'createSessionMutation'}),
 graphql(stopSessionMutation, {
   name: 'stopSessionMutation'
 })
)(AdminContainer)
export default AdminContainerWithMutation;
