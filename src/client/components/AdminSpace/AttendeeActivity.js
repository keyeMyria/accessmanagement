import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import DirectionsWalk from 'material-ui-icons/DirectionsWalk';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { CircularProgress } from 'material-ui/Progress';
import dateFormat from 'dateformat';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import EmptyActivityAttendeesIcon from '../App/EmptyActivityAttendees.svg';
import {REMOTE_ASSETS_PATH} from '../../app/config';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Grow from 'material-ui/transitions/Grow';

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
  ListProfil:{
    backgroundColor:"#fff",
    maxWidth:'700px',
    margin:'0 auto 16px',
    boxShadow:'0 1px 4px 0 rgba(0,0,0,.14)',
  },
  chip: {
    backgroundColor: '#003489',
    width: '700px',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar:{
      margin: '10px',
  },
  name:{
    color: 'white',
    fontSize: '15px',
  },
  time:{
    maxWidth: '42%',
  }
});
 class AttendeeActivity  extends React.Component{
  render(){
    const {classes} = this.props;


    return(
    <Grow in={true} {...(true ? { timeout: 300 } : {})}>
      <div>
        {(this.props.data.loading==true) && (
          <div className={classes.root}><CircularProgress  color="primary" className={classes.progressCircle} /></div>
        )}

        {((this.props.data.loading == false && this.props.data.activity==null) || (this.props.data.loading == false && Object.keys(this.props.data.activity).length === 0)) && (
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
        )}

        {(this.props.data.activity!=undefined && Object.keys(this.props.data.activity).length > 0) && (
          <div className={classes.root}>
           <div className={classes.chip}>
              <Avatar className={classes.avatar} src={`${REMOTE_ASSETS_PATH}/${this.props.data.activity[0].user.profile.avatar}`}/>
              <p className={classes.name} >{this.props.data.activity[0].user.profile.name} {this.props.data.activity[0].user.profile.forname}</p>
            </div>
            <List className={classes.ListProfil}>
              {this.props.data.activity.map(value => (
                <ReactCSSTransitionGroup
                    transitionName="fadeItem"
                    transitionEnterTimeout={400}
                    transitionLeaveTimeout={400}>
                  <ListItem key={value.id} dense>
                    <ListItemText className={classes.time} primary={`${value.action=="IN" ? "دخل" : "غادر"} الجلسة,  ${dateFormat(value.dateEntry , 'HH:mm:ss')}`} />
                    {value.agent &&(<ListItemText secondary={`سجل من قبل ${value.agent.username}`  }/>)}
                    <DirectionsWalk className={classes[value.action]}/>
                  </ListItem>
                </ReactCSSTransitionGroup>
              ))}
            </List>
          </div>
        )}

      </div>
    </Grow>
    )
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
