import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction,ListItemIcon, ListItemText } from 'material-ui/List';
import {Link} from 'react-router-dom';
import DirectionsWalk from 'material-ui-icons/DirectionsWalk';
import AirlineSeatReclineNormal from 'material-ui-icons/AirlineSeatReclineNormal';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SearchComponent from './SearchComponent';
import {red , lightblue} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Search from 'material-ui-icons/Search';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import idcard from './id-card.svg';
import NavBarContainer from '../../containers/NavBarContainer';
import BottomToolbarContainer from '../../containers/BottomToolbarContainer';
const drawerWidth = 240 ;

const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
    padding: '60px 16px 0',
  },
  IN:{
    fill :"#00abc7",
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    'transform': 'rotateY(180deg)',

  },
  search:{
    width: '100%',
  },
  listItem:{
    paddingRight: 0,
    paddingLeft: 0,
  },
  OUT:{
    fill :"#ff1850",
  },
  listItemText:{
    width:'20%',
  },
  empty_img:{
  display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '280px',
	height: '280px',
	minHeight: '280px',
	minWidth: '280px',
	borderRadius: '50%',
	background: '#ffffff',
},
empty_imgSvg:{
  width: '200px',
	height: '200px',
},
empty:{
    height: '100vh',
    minHeight: '80vh',
  	display: 'flex',
  	flexDirection: 'column',
  	alignItems: 'center',
  	justifyContent: 'center',
  	textAlign: 'center',
  	padding: '10vh 10vw',
  	background: '#f7f7f7',
    fontFamily: 'Roboto, sans-serif',
},
empty_title:{
  fontSize:'2em',
	color: 'rgba(0, 0, 0, 0.34)',
},
empty_description:{
  color: 'rgba(0, 0, 0, 0.56)',
}
});

class Attendies extends React.Component {
        constructor(props){
          super(props)
          this.state = {
            checked: [1] ,
            attendies_list :[] ,
            unfiltered_list :[]

          };
        }

  componentWillReceiveProps(newProps) {
    if(newProps.data.guestusers){
      let out = newProps.data.guestusers.filter(user => user.status =="IN");
      this.setState({
        attendies_list : newProps.data.guestusers,
        unfiltered_list : newProps.data.guestusers,
        total : newProps.data.guestusers.length,
        in_attendies : out.length ,
        out_attendies : newProps.data.guestusers.length - out.length ,
        present_precent : (out.length/newProps.data.guestusers.length) * 100
      });
    }

  }
  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };
  filterList =(event)=>{
    var updatedList = this.state.attendies_list;
    if(event.target.value==''){
      updatedList = this.state.unfiltered_list ;
    }
    else{
      updatedList = updatedList.filter(function(item){

        return item.profile.name.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1 || item.profile.forname.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1  ;
      });
    }

    this.setState({attendies_list: updatedList});

  };

  render() {
    const { classes } = this.props;
    if(this.props.data.loading==true)
      return(<div className={classes.root}><CircularProgress color="accent" /></div>);
    else if (this.props.data.guestusers==null || Object.keys(this.props.data.guestusers).length === 0) {
        return (
              <div elevation={4} className={classes.empty}>
                <div className={classes.empty_img}>
                  <object type="image/svg+xml" data={idcard} className={classes.empty_imgSvg}/>
                </div>
                <Typography type="body1" component="h3" className={classes.empty_title}>
                   NoBody has presented his pass yet
                </Typography>
                <Typography type="subheader" component="p" className={classes.empty_description}>
                   Use the capture code to register the entry and the exit of the participants
                </Typography>
             </div>
          );
}
else{

    return (<div className={classes.root} >

        <Input
			       endAdornment={
              <InputAdornment position="end">
                <IconButton >
                  <Search />
                </IconButton>
              </InputAdornment>
            }
            className={classes.search}
              placeholder="Search Attendies" onChange={this.filterList}
            />
            <List style={{textAlign: 'right',}}>
              {this.state.attendies_list.map(value => (
                <ListItem key={value._id} dense button className={classes.listItem}>
                  <Avatar alt="" src={`/public/assets/avatars/${value.profile.avatar}`} />
                  <ListItemText primary={`${value.profile.name} ${value.profile.forname}`} className={classes.listItemText} />
                  <ListItemText primary={`${value.status}door`} className={classes.listItemText} />
                  { value.status=='ABSCENT' ? 'Abscent' : `${value.status.toLowerCase()}door`}

					{ value.status =="OUT" && (
                  <DirectionsWalk className={classes.OUT}/>
					)}
					{ value.status =="IN" && (
                  <AirlineSeatReclineNormal className={classes.IN}/>
					)}

                </ListItem>
              ))}
            </List>

    </div>)
}


  }
}

Attendies.propTypes = {
  classes: PropTypes.object.isRequired,
};
const CurrentUserForLayout = gql`
  query CurrentUserForLayout {
    guestusers {
      username
      status
      profile{
        name
        forname
        avatar
        tel

      }

    }
  }
`;

const AttendeesWithData = graphql(CurrentUserForLayout)(Attendies);
export default withStyles(styles)(AttendeesWithData);
