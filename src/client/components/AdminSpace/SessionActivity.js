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
import Grow from 'material-ui/transitions/Grow';
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
  container:{
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  OUT:{
    fill :"#ef4035",
  },
  nameProfil:{
    flexGrow:'2',
    maxWidth: '350px',
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
            {
              // <Grow in={true}>
            }
             <ListItem className={classes.ListProfil} dense>
                <Avatar src={`${REMOTE_ASSETS_PATH}/${entry.user.profile.avatar}`} />
                <ListItemText className={classes.listeItem} secondary={`${moment(entry.dateEntry).utcOffset(1, true).format('HH:mm:ss')}`}  />
                <ListItemText className={classes.nameProfil} primary={`${entry.user.profile.name} ${entry.user.profile.forname}`} />
                <ListItemText className={classes.listeItem} secondary={`${entry.action=="IN" ? " حاضر داخل " : "غادر(ت)"} الجلسة `  }/>
                {entry.agent &&(<ListItemText className={classes.listeItem} secondary={` مسجل بواسطة :  ${entry.agent.username}`  }/>)}
                <DirectionsRun className={classes[entry.action]}/>
              </ListItem>
              <Divider className={classes.line}inset/>
              {
                // </Grow>
              }
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
