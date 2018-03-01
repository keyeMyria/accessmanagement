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
import ExitToApp from 'material-ui-icons/ExitToApp';
import {Link} from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

const container = {
    overflow: 'auto',
    // marginBottom: '56px',
};
const styles = theme => ({
  drawerPaper: {
    width: 210,
  },
  drawerInner: {
    width: '100%',
  }
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
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="الخروج" />
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
