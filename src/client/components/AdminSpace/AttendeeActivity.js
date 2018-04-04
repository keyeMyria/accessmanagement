import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import DirectionsWalk from 'material-ui-icons/DirectionsWalk';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { CircularProgress } from 'material-ui/Progress';
import dateFormat from 'dateformat';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import EmptyActivityAttendeesIcon from '../App/EmptyActivityAttendees.svg';
import {REMOTE_ASSETS_PATH} from '../../app/config'

const styles = theme => ({
  root: {
    width: '100%',
  },
  IN:{
    fill :"#00B0FF",
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    'transform': 'rotateY(180deg)',

  },
  OUT:{
    fill :"#ef4035",
  },
  progressCircle:{
    margin: '16px 0 0 0',
  },
});
 class AttendeeActivity  extends React.Component{
  render(){
    const {classes} = this.props;
    if(this.props.data.loading==true)
      return(<div className={classes.root}><CircularProgress  color="primary" className={classes.progressCircle} /></div>);
      else if (this.props.data.activity==null || Object.keys(this.props.data.activity).length === 0) {
          return (
              <div className={classes.root} className="emptyStatus">
                <div className="emptyStatusIcon">
                  <EmptyActivityAttendeesIcon/>
                </div>
                 <h3 className="emptyStatusTitle">
                    لم يتم تسجيل اي دخول بعد
                 </h3>
                 <p className="emptyStatusDesciption">
                   سيتم عرض تحركات المشارك حال ما يتم تسجيل مروره من قبل الوكلاء
                 </p>
              </div>
            );
  }
  else{
    return(<div className={classes.root}>
        <List>
          {this.props.data.activity.map(value => (
            <div><ListItem key={value.id} dense>
              <Avatar src={`${REMOTE_ASSETS_PATH}/${value.user.profile.avatar}`} />
              <ListItemText secondary={`${dateFormat(value.dateEntry , 'HH:mm:ss')}`} />
              <ListItemText primary={`${value.user.profile.name} ${value.user.profile.forname}`} />
              <ListItemText secondary={`${value.action=="IN" ? "joined" : "left"} the conference`  }/>
              {value.agent &&(<ListItemText secondary={`Registered By ${value.agent.username}`  }/>)}
              <DirectionsWalk className={classes[value.action]}/>
            </ListItem>
            <Divider inset/></div>
          ))}
        </List>
      </div>)
  }

  }
}
const historylist = gql`
  query historylist($id: String!) {
    activity(id :$id) {
      entryId
      dateEntry
      action
      user{
        username
        profile{
          name
          forname
          tel
          avatar
        }
      }
      agent{username}

    }
  }
`;


const AttendeeActivityWithData = graphql(historylist ,  {
  options: (props) => ({ variables: { id: props.match.params.id } })
})(AttendeeActivity);
export default withStyles(styles)(AttendeeActivityWithData);
