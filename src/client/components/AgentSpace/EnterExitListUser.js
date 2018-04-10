import React from 'react';
import {observer} from 'mobx-react';
import UserStore from '../../mobx/gueststore';
import List, { ListItem, ListItemSecondaryAction,ListItemIcon, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import {REMOTE_ASSETS_PATH} from '../../app/config'


@observer
class EnterExitListUser extends React.Component{
  constructor(props){
    super(props)
    let id = localStorage.getItem('loogedin_id');    
    UserStore.fetchGuestForAgentWorkshop(id);
    let fetched_user = UserStore.fetchUserRole(id);
    fetched_user.then(res=>{
      this.setState({
        role:res.role.name
      })
    })
  }
  addOperationToGuest =(guest , operation , agent , workshop)=>{
    UserStore.alterGuestStatus(guest , operation , agent, workshop);
  }

  render(){

    if(UserStore.users!=null){
      return(<div>
        <List>
        {UserStore.users.map(value => {
          return(
            <div key={value._id}>{value.profile!=null &&(
              <ListItem  dense button>
              <Avatar alt="" src={`${REMOTE_ASSETS_PATH}/${value.profile.avatar}`} />
              <ListItemText primary={`${value.profile.name} ${value.profile.forname}`}/>
              <ListItemText primary={`${value.status}`} />
              {(this.state.role=='agent_in' || this.state.role=='agent_in_out') &&(<Button  raised="true" color="secondary"   onClick={()=>this.addOperationToGuest(value._id , "IN" , id , UserStore.selectWorkshopAgent._id )}>
                     دخول
              </Button>)}
              {(this.state.role=='agent_out' || this.state.role=='agent_in_out')&&(<Button   raised="true" color="secondary"   onClick={()=>this.addOperationToGuest(value._id , "OUT" , id , UserStore.selectWorkshopAgent._id)}>
                   خروج
              </Button>)}
            </ListItem>)}</div>
          )
        }
         
        )}
      </List>
  </div>)
}else{
  return(<div>Either you're not affected to any workshop or no guest are present yet </div>)
}

  }
}
export default EnterExitListUser;
