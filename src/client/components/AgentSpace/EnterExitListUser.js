import React from 'react';
import {observer} from 'mobx-react';
import UserStore from '../../mobx/gueststore';
import List, { ListItem, ListItemSecondaryAction,ListItemIcon, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';

const role = localStorage.getItem('role');
const id = localStorage.getItem('loogedin_id');

@observer
class EnterExitListUser extends React.Component{
  constructor(props){
    super(props)
    UserStore.fetchGuestForAgentWorkshop(id);


  }
  addOperationToGuest =(guest , operation , agent)=>{
    UserStore.alterGuestStatus(guest , operation , agent);
  }
  render(){
    if(UserStore.users!=null){
      return(<div>
        <List>
        {UserStore.users.map(value => (
          <ListItem key={value._id} dense button>
            <Avatar alt="" src={`/public/assets/avatars/${value.profile.avatar}`} />
            <ListItemText primary={`${value.profile.name} ${value.profile.forname}`}/>
            <ListItemText primary={`${value.status}`} />
            {(role=='agent_in' || role=='agent_in_out') &&(<Button raised color="accent" onClick={()=>this.addOperationToGuest(value._id , "IN" , id )}>
                   دخول
            </Button>)}
            {(role=='agent_out' || role=='agent_in_out')&&(<Button  raised color="accent" onClick={()=>this.addOperationToGuest(value._id , "OUT" , id )}>
                 خروج
            </Button>)}
          </ListItem>
        ))}
      </List>
  </div>)
    }

  }
}
export default EnterExitListUser;
