import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

import {Link} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';
import dateFormat from 'dateformat';
import { withRouter } from 'react-router'
import Drawer from 'material-ui/Drawer';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ArrowBack from 'material-ui-icons/ArrowBack';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Switch from 'material-ui/Switch';
import Chip from 'material-ui/Chip';
import FaceIcon from 'material-ui-icons/Face';
import GroupWork from 'material-ui-icons/GroupWork';
import Avatar from 'material-ui/Avatar';
import { compose } from 'react-apollo';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {

  },
  back:{
    right: 0,
  },
  styleChip:{
    color:'#00348A',
    backgroundColor: '#fff',
  },
  styleButton:{
    color:'#fff',
  },
});
class AppBarComponent extends React.Component{
  constructor(props) {
		super(props);
		this.state = {
			open: false,
			title: props.title || 'PWA with React' ,
      auth: true,
      drawer_open :false ,
      anchorEl: null,
		};

		this.handleRequestChange = this.handleRequestChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.goBack =this.goBack.bind(this);
    this.logout = this.logout.bind(this);
	}
    goBack =()=>{
      this.props.history.goBack()
    }
    logout =()=>{
      this.props.history.push('/signout')
    }
    handleChange = (event, checked) => {
      this.setState({ auth: checked });
    };

    handleMenu = event => {
      this.setState({ anchorEl: event.currentTarget });
    };

    handleRequestClose = () => {
      this.setState({ anchorEl: null });
    };

  	handleRequestChange(open) {
  		this.setState({open});
  	}

	handleClose(e) {
		//console.log(e.nativeEvent);
		this.setState({open: false});
		e.preventDefault();
	}
  isAnActiveSession(){
    if(this.props.activeSession.activeSession!=null){
      return true;
    }
  }
  isAClosedSession(){
    if(this.props.closedSession.closedSession!=null){
      return true;
    }
  }
  render(){
    const {authenticated , role}= this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const {classes} = this.props;
    return(
          <div>{authenticated &&(
            <AppBar position="fixed" color="inherit">
              <Toolbar>
                <IconButton
                  aria-label="open drawer"
                  onClick={this.props.handleDrawerOpen}
                   className={classes.styleButton}
                  >
                <MenuIcon />
              </IconButton>
              {
              //   {authenticated && this.isAnActiveSession()&&(<Chip
      				//   avatar={
      				// 	  <Avatar className={classes.styleChip}>
      				// 		<GroupWork />
      				// 	  </Avatar>
      				// 	}
      				// 	label={`session opened ${dateFormat(this.props.activeSession.activeSession.start_hour , 'd/m/yy')} : ${dateFormat(this.props.activeSession.activeSession.start_hour , 'HH:mm')}`}
      				// 	className={classes.styleChip}
      				// />)}
              //   {authenticated && this.isAClosedSession()&& !this.isAnActiveSession() &&(<Chip
              //   avatar={
              //     <Avatar className={classes.styleChip}>
              //     <GroupWork />
              //     </Avatar>
              //   }
              //   label={`session closed ${dateFormat(this.props.closedSession.closedSession.end_hour , 'd/m/yy')} : ${dateFormat(this.props.closedSession.closedSession.end_hour , 'HH:mm')}`}
              //   className={classes.styleChip}
              // />)
              }
              <IconButton onClick={this.goBack} aria-label="Menu" className={classes.styleButton}>
                <ArrowBack />
              </IconButton>
          </Toolbar>
          </AppBar>
        )}</div>
    )
  }
}
const activeSession = gql`
  query activeSession{
    activeSession {
      _id
      start_hour
    }
  }
`;
const closedSession = gql`
  query closedSession{
    closedSession {
      _id
      start_hour
    }
  }
`;
const AppBarFilled = compose(
 graphql(activeSession, {
   name : 'activeSession'
 }),
 graphql(closedSession, {
   name : 'closedSession'
 }),
 )(AppBarComponent)
const AppBarComponentWithRouter = withRouter(AppBarFilled)
export default withStyles(styles)(AppBarComponentWithRouter);
