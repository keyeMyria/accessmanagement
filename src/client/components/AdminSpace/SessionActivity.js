import React from 'react';
import {observer} from 'mobx-react' ;
import SessionStore from '../../mobx/sessionstore';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {REMOTE_ASSETS_PATH} from '../../app/config'

const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
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
            activitylistbysessionID :[...prev.activitylistbysessionID, newEntry]
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
      return(<div>
        <ul>
          {this.props.data.activitylistbysessionID.map(entry=>{
            return(
            <div key={entry.entryId}><ListItem  dense>
                <Avatar src={`${REMOTE_ASSETS_PATH}/${entry.user.profile.avatar}`} />
                <ListItemText secondary={`${moment(entry.dateEntry).utcOffset(1, true).format('hh:mm:ss')}`}  />
                <ListItemText primary={`${entry.user.profile.name} ${entry.user.profile.forname}`} />
                <ListItemText secondary={`${entry.action=="IN" ? "joined" : "left"} the conference`  }/>
                {entry.agent &&(<ListItemText secondary={`Registered By ${entry.agent.username}`  }/>)}
                <DirectionsRun className={classes[entry.action]}/>
              </ListItem>
              <Divider inset/></div>
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
