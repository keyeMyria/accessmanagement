import React from 'react';
import QReaderComponent from './QReaderComponent';
import AgentBottomToolbar from './AgentBottomToolbar';
import BottomToolbarContainer from '../../containers/BottomToolbarContainer';
import NavBarContainer from '../../containers/NavBarContainer';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import GroupWork from 'material-ui-icons/GroupWork';
import PersonPin from 'material-ui-icons/PersonPin';
import {Link} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
const drawerWidth = 240 ;
const container = {
    overflow: 'auto',
    marginBottom: '56px',
};
const styles = theme => ({
  drawerPaper: {
    //height: '100%',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64,
      },
    },
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  } ,
   appFrame: {
     position: 'relative',
     display: 'flex',
     width: '100%',
     height: '100%',
   },
   appBar: {
     position: 'absolute',
     transition: theme.transitions.create(['margin', 'width'], {
       easing: theme.transitions.easing.sharp,
       duration: theme.transitions.duration.leavingScreen,
     }),
   },
   appBarShift: {
     width: `calc(100% - ${drawerWidth}px)`,
     transition: theme.transitions.create(['margin', 'width'], {
       easing: theme.transitions.easing.easeOut,
       duration: theme.transitions.duration.enteringScreen,
     }),
   },

});
class AgentContainer extends React.Component{
  constructor(props){
    super(props);
    this.state={
      drawer_open: false
    }
  }
  handleDrawerOpen = () =>{
       this.setState({ drawer_open: true });
  }
  handleDrawerClose=()=>{
    this.setState({ drawer_open: false });
  }
  render(){
    const {classes} = this.props;
    const drawer = (
      <Drawer
        type="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        open={this.state.drawer_open}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />

            <Link to="/signout" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemIcon>
            <PersonPin />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItem></Link>
        </div>
      </Drawer>

    );
    return (
      <div  style={container}>
          <NavBarContainer
            handleDrawerOpen = {this.handleDrawerOpen}
          />

          {this.props.children}
          <BottomToolbarContainer/>
          {drawer}
    </div>);

  }
}
export default withStyles(styles)(AgentContainer);
