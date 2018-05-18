import React from 'react';
import {observer} from 'mobx-react' ;
import SessionStore from '../../mobx/sessionstore';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DirectionsWalk from 'material-ui-icons/DirectionsWalk';
import AirlineSeatReclineExtra from 'material-ui-icons/AirlineSeatReclineExtra';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Grow from 'material-ui/transitions/Grow';
import {REMOTE_ASSETS_PATH} from '../../app/config'

const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
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
  },
  container:{
      backgroundColor:"#fff",
      maxWidth:'700px',
      margin:'0 auto 16px',
      borderTop: '5px solid #003489',
      boxShadow:'0 1px 4px 0 rgba(0,0,0,.14)',
  },
  nameProfil:{
    flexGrow:'2',
    maxWidth: '350px',
    width:'30%',
  },
  ListProfil:{
    backgroundColor:"#fff",
  },
  List:{
    marginTop: '10px',
  },
  listeItem:{
    flexGrow: '1',
  },
  line:{
    margin: 0,
  }
   });
// @observer
class SessionActivity extends React.Component{
  constructor(props){
    super(props);
    // SessionStore.getEntriesBySessionId(props.match.params.id)
  }
  componentWillMount=()=>{
    this.props.data.subscribeToMore({
      document : entrySubscription,
      variables: {
        sessionId: this.props.match.params.id,
      },
      updateQuery :(prev , {subscriptionData})=>{
        if(!subscriptionData.data){
          return prev;
        }
        const newEntry = subscriptionData.data.newEntry;
        if(!prev.activitylistbysessionID.find((item)=> item.entryId==newEntry.entryId)){
          return Object.assign({} , prev ,{
            activitylistbysessionID :[newEntry , ...prev.activitylistbysessionID]
          })
        }else{
          return prev;
        }
      }
    });
  }
  render(){
    const {classes} = this.props;
    if(this.props.data.activitylistbysessionID!=null){
      return(
        <div className={classes.container}>
          <ul className={classes.List}>
          {this.props.data.activitylistbysessionID.map(entry=>{
            return(
            <div key={entry.entryId}>
             <ListItem className={classes.ListProfil}>
                <Avatar src={`${REMOTE_ASSETS_PATH}/${entry.user.profile.avatar}`} />
                <ListItemText className={classes.nameProfil} primary={`${entry.user.profile.name} ${entry.user.profile.forname}`} />
                <ListItemText className={classes.listeItem} secondary={`${entry.action=="IN" ? " دخل(ت) " : "غادر(ت)"} الجلسة ،${moment(entry.dateEntry).utcOffset(1, true).format('HH:mm:ss')}` }/>
                {entry.agent &&(<ListItemText className={classes.listeItem} secondary={` مسجل من قبل :  ${entry.agent.username}`  }/>)}
                {entry.action == 'OUT' ? (
                  <DirectionsWalk className={classes.OUT} />
                ) : (
                  <AirlineSeatReclineExtra className={classes.IN} />
                )}
              </ListItem>
              <Divider className={classes.line}inset/>
              </div>
            )
          })}
        </ul>
      </div>)
    }else{
      return(<div>No Items to display</div>)
    }
  }
}
export const listEntriesBySession = gql`
  query activitylistbysessionID($sessionId:ID){
            activitylistbysessionID(sessionId:$sessionId){
              entryId
              dateEntry
              action
              agent{
                username
              }
              user{
                _id
                profile{
                  name
                  forname
                  avatar
                }
              }
            }
          }
`
const entrySubscription = gql`
          subscription {
            newEntry{
              entryId
              dateEntry
              action
              agent{
                username
              }
              user{
                _id
                profile{
                  name
                  forname
                  avatar
                }
              }
            }

          }
`
export default withStyles(styles)(graphql(listEntriesBySession, {

  options: (props)=>({ variables: { sessionId: props.match.params.id } }),
})(SessionActivity));
