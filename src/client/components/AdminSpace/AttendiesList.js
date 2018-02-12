import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Search from 'material-ui-icons/Search';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {red , lightblue} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Input, { InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import AttendeeCard from './AttendeeCard';
import { CircularProgress } from 'material-ui/Progress';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell} from 'recharts';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth:'1200px',
    margin:'auto',
  },
  formControl: {
    width: '100%',
    padding:'16px',
  },
  IN:{
    fill :"#00abc7",
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    'transform': 'rotateY(180deg)',

  },
  OUT:{
    fill :"#ef4035",
  } ,

});


class AttendiesList extends React.Component {

  state = {
    checked: [1] ,
    total :0 ,
    in_attendies : 0,
    out_attendies : 0 ,
    present_precent : 0 ,
    attendies_list : [],
    unfiltered_list : []
  };
componentWillReceiveProps(newProps) {
  if(newProps.data.guestusers){
    let out = newProps.data.guestusers.filter(user => user.status =="IN");
    this.setState({
      attendies_list : newProps.data.guestusers,
      unfiltered_list : newProps.data.guestusers,
      total : newProps.data.guestusers.length,
      in_attendies : out.length ,
      out_attendies : (newProps.data.guestusers.length - out.length)/newProps.data.guestusers.length * 100 ,
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
      return(<div className={classes.root}><CircularProgress color="primary" /></div>);
      else if (this.props.data.guestusers==null || Object.keys(this.props.data.guestusers).length === 0) {
          return (
              <div className={classes.root}>
                 <Typography type="body1" component="h3">
                   NoBody has presented his pass yet
                 </Typography>
                 <Typography type="subheader" component="p">
                   Use the capture code to register the entry and the exit of the participants
                 </Typography>
              </div>
            );
  }
  else{

      const data = [
        {name: 'indoor', value: this.state.present_precent},
        {name: 'outdoor', value: this.state.out_attendies},
      ];

	  const COLORS = ['#00ABC7', '#cccccc'];

      return (
        <div className={classes.root}>

         <FormControl className={classes.formControl}>
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
        </FormControl>
        <emptyAttendeesList className={classes.icon}/>
        <List >
          {this.state.attendies_list.map(value => (
          <AttendeeCard  key={value._id} data={value} dense className={classes.listItem}  />
          ))}
        </List>
      </div>)
  }
  }
}

AttendiesList.propTypes = {
  classes: PropTypes.object.isRequired,
};
const guestlist= gql`
  query guestlist {
    guestusers {
      _id
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

const AttendeesWithData = graphql(guestlist)(AttendiesList);
export default withStyles(styles)(AttendeesWithData);
