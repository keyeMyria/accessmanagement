import React from 'react';
import {observer} from 'mobx-react' ;
import SessionStore from '../../mobx/sessionstore';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';

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
@observer
class SessionActivity extends React.Component{
  constructor(props){
    super(props);
    SessionStore.getEntriesBySessionId(props.match.params.id)
  }
  render(){
    const {classes} = this.props;

    if(SessionStore.sessionEntries!=null){
      return(<div>
        <ul>
          {SessionStore.sessionEntries.map(entry=>{
            return(
              <li>
              <ListItem key={entry.id} dense>
                <Avatar src={entry.user.profile.avatar} />
                <ListItemText secondary={`${moment(entry.dateEntry).utcOffset(1, true).format('hh:mm:ss')}`}  />
                <ListItemText primary={`${entry.user.profile.name} ${entry.user.profile.forname}`} />
                <ListItemText secondary={`${entry.action=="IN" ? "joined" : "left"} the conference`  }/>
                {entry.agent &&(<ListItemText secondary={`Registered By ${entry.agent.username}`  }/>)}
                <DirectionsRun className={classes[entry.action]}/>
              </ListItem>
              <Divider inset/>
              </li>
            )
          })}
        </ul>
      </div>)
    }
  }
}
export default withStyles(styles)(SessionActivity);
