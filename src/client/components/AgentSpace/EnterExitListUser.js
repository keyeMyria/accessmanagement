import React from 'react';
import {observer} from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import UserStore from '../../mobx/gueststore';
import List, { ListItem, ListItemSecondaryAction,ListItemIcon, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import {REMOTE_ASSETS_PATH} from '../../app/config'

const styles = theme => ({
  containerLists:{
    margin:'70px auto',
    backgroundColor: 'white',
    width: '95%',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.07)',
  },
  profileName:{
    maxWidth: '500px',
    marginLeft: '0',
  },
});

@observer
class EnterExitListUser extends React.Component{
  constructor(props){
    super(props)
    UserStore.fetchGuestForAgentWorkshop(props.userid);
    UserStore.fetchUserRole(props.userid);
    
  }
  addOperationToGuest =(guest , operation , agent , workshop)=>{
    UserStore.alterGuestStatus(guest , operation , agent, workshop);
  }

  render(){
    const {classes}=this.props;
    if(UserStore.users!=null){
      return(
        <div>
        <List className={classes.containerLists}>
        {UserStore.users.map(value => {
          return(
            <div key={`div${value._id}`}>{value.profile!=null &&(
              <ListItem  dense button>
              <Avatar alt="" src={`${REMOTE_ASSETS_PATH}/${value.profile.avatar}`} />
              <ListItemText className={classes.profileName} primary={`${value.profile.name} ${value.profile.forname}`}/>
              <ListItemText primary={value.status== "IN" && ' حاضر(ة) داخل الجلسة' || value.status== "OUT" && ' غادر(ة) الجلسة ' || value.status== "ABSCENT" && ' غائب(ة) '} />
              {UserStore.currentAgent!=null&&(<div>
                  {(UserStore.currentAgent.role=='agent_in' || UserStore.currentAgent.role=='agent_in_out') &&(<Button  raised="true" color="secondary"   onClick={()=>this.addOperationToGuest(value._id , "IN" , UserStore.currentAgent , UserStore.selectWorkshopAgent._id )}>
                  دخول
                   </Button>)}
                  {(UserStore.currentAgent.role=='agent_out' || UserStore.currentAgent.role=='agent_in_out')&&(<Button   raised="true" color="secondary"   onClick={()=>this.addOperationToGuest(value._id , "OUT" , UserStore.currentAgent , UserStore.selectWorkshopAgent._id)}>
                    خروج
                    </Button>)}</div>
              )}
            
            </ListItem>)}
            </div>
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
function mapStateToProps(state) {
  return { userid: state.auth.userid ,
  role:state.auth.role};
}


export default withStyles(styles)(connect(mapStateToProps)(EnterExitListUser));
