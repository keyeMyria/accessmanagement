import React from 'react';
import {observer} from 'mobx-react';
import EventStore from '../../mobx/eventstore';
import WorkshopStore from '../../mobx/workshopstore';
import UserStore from '../../mobx/gueststore';
import form from '../../mobx/forms/addworkshop';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import dateFormat from 'dateformat';
import { withStyles } from 'material-ui/styles';
import Dialog , {DialogActions} from 'material-ui/Dialog';
import List, { ListItem, ListItemText , ListItemSecondaryAction } from 'material-ui/List';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Stop from 'material-ui-icons/Stop';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import PlayButton from './vendor/play.svg';
import LectureIcon from './vendor/lecture.svg';
//import PlayButton from './vendor/playButton.svg';
import WorkShopForm from './addWorkShopForm';
import Add from 'material-ui-icons/Add'
const styles = theme => ({
  card: {
    backgroundColor : '#053787',
    color :'white'
  } ,
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  icon :{
    maxWidth :'50%'
  } ,
  sessionItem :{
    borderLeft : '8px solid #053787' ,
    paddingTop : '5px'
  } ,
  workshopItem:{
    borderLeft : '8px solid #FC4482' ,
    marginTop : '5px',
    minHeight : '80px'
  },
  sessionListWork:{
    paddingTop :'0px' ,
    paddingBottom : '0px',
    marginTop : '0px'
  },
  workshopsessionitem:{
    borderLeft : '8px solid #CECECE' ,
    backgroundColor :'#F5F5F5',
    minHeight : '30px',
    marginLeft : '30px'
  },
  AddingButton :{
    minHeight : '70px' ,
    margin : '10px',
    textTransform :'none' ,
    fontsize : '0.2em'
  },
  workshopform:{
    width : '100%'
  },
  userItem :{
    width : '50%' ,
    float : 'right'
  }
});
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@observer
class EventDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
     open: false,
     open_workshop:false
   };
   WorkshopStore.getWorkshopsForEvent(props.match.params.id);
   EventStore.getEventByID(this.props.match.params.id);
   UserStore.getUsers();

  }

 handleClickOpen = () => {
   this.setState({ open: true });
 };
  handleClickOpenWorkshop = ()=>{
    this.setState({ open_workshop: true });

  }
 handleClose = () => {
   this.setState({ open: false });
 };
 handleCloseWorkshop = ()=>{
   this.setState({ open_workshop: false });

 }

 startSessionAction =() =>{
   EventStore.startSessionForEvent(this.props.match.params.id);
 }
 stopSessionAction =(sessionid) =>{
   EventStore.stopSessionForEvent(sessionid , this.props.match.params.id);
 }
 startSessionForWorkshop =(workshopid)=>{
   WorkshopStore.addNewSessionForWorkShop(workshopid);
 }
 stopSessionForWorkShop =(workshopid) =>{
   WorkshopStore.stopSessionForWorkShop(workshopid);

 }
  render(){
    const event = EventStore.selectedEvent;
    const workshoplist = WorkshopStore.workshops;
    WorkshopStore.setSelectedWorkShopEvent(this.props.match.params.id);
    const {classes} = this.props;
    if(WorkshopStore.state=='loading'){
      return(
        <div><CircularProgress className={classes.progress} color="accent" /></div>);
    }

    return(
      <div>
        <Dialog
         fullScreen
         open={this.state.open}
         onClose={this.handleClose}
         transition={Transition}
       >
         <AppBar className={classes.appBar}>
           <Toolbar>
             <IconButton color="contrast" onClick={this.handleClose} aria-label="Close">
               <CloseIcon />
             </IconButton>
             <Typography type="title" color="inherit" className={classes.flex}>
               start a new session
             </Typography>

           </Toolbar>
         </AppBar>
         <div>
           <PlayButton className={classes.icon}/>
         <h3>New Session</h3>
         <Button raised color="primary" onClick={this.startSessionAction} className={classes.button}>
           Start
         </Button>
         <Button raised color="accent" onClick={this.handleClose} className={classes.button}>
           Cancel
         </Button>
       </div>
       </Dialog>
       <Dialog
        fullScreen
        open={this.state.open_workshop}
        onClose={this.handleCloseWorkshop}
        transition={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleCloseWorkshop} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Add a new Workshop
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.workshopform}><LectureIcon className={classes.icon}/>
        <WorkShopForm form={form} users={UserStore.users}/>
        </div>
        <DialogActions>
          <Button onClick={form.onSubmit} color="primary">
            Confirm
          </Button>
          <Button onClick={this.handleCloseWorkshop} color="primary">
            Cancel
          </Button>
        </DialogActions>
        </Dialog>

      <div className={classes.card}>
        <Button  fab raised color="accent" aria-label="edit Event">
          <ModeEditIcon />
        </Button>
          <h3>
            {event.title}
          </h3>
          <h3>{event.type}</h3>
          <span>{event.place}</span>
          <p>{`starts at : ${dateFormat(event.start_date , 'dd/mm/yyyy')}`}</p>
          <p>{`ends at : ${dateFormat(event.end_date , 'dd/mm/yyyy')}`}</p>
    </div>

    <Button onClick={this.handleClickOpenWorkshop} className={classes.AddingButton}>
      <Add />
      Add Workshop
    </Button>
    {event.session_empty  &&(<Button onClick={this.handleClickOpen}  className={classes.AddingButton}>
      <Add />
      Add Session
    </Button>)}
    {event.session_empty==null  &&(<Button onClick={this.handleClickOpen} className={classes.AddingButton}>
      <Add />
      Add Session
    </Button>)}
      <List>
      {
        event.sessions.map((item) => (
          <div  key={item._id}>
            <ListItem className={classes.sessionItem}>
            <ListItemText primary="General Session" secondary={`starts at : ${dateFormat(item.start_hour , 'hh:mm')}`} />
            {item.stat=='OFF' &&(<ListItemText secondary={`closed at : ${dateFormat(item.end_hour , 'hh:mm')}`} />
            )}
              {item.stat=='ON' &&(<Button onClick={()=>this.stopSessionAction(item._id)}><Stop color="accent" />
              stop session</Button>)}
            </ListItem>
            <Divider/>
        </div>
        ))
      }
    </List>
      {workshoplist!==undefined &&(
        <List>
        {
          workshoplist.map((item) => (
            <div key={item._id} >
              <ListItem className={classes.workshopItem}>
              <ListItemText primary={item.name} />
                {item.session_empty==true &&(
                  <div><Button onClick={()=>this.startSessionForWorkshop(item._id)}><PlayArrow color="primary" />
                  Start session</Button></div>
                )}
                {item.session_empty==null &&(
                  <div><Button onClick={()=>this.startSessionForWorkshop(item._id)}><PlayArrow color="primary" />
                  Start session</Button></div>
                )}
                {item.session_empty==false &&(
                  <div><Button onClick={()=>this.stopSessionForWorkShop(item._id)}><Stop color="accent" />
                  Stop session</Button></div>
                )}
                </ListItem>

                  <List className={classes.sessionListWork}>
                    {
                      item.sessions.map((lol) => (
                        <div key={lol._id}><ListItem className={classes.workshopsessionitem}>
                          <ListItemText secondary={`starts at : ${dateFormat(lol.start_hour , 'hh:mm')}`} />
                            {lol.stat=='OFF' &&(<ListItemText secondary={`closed at : ${dateFormat(lol.end_hour , 'hh:mm')}`} />
                            )}
                        </ListItem>
                        <Divider/>
                        </div>


                      ))

                    }
                  </List>
                  <Divider/>

          </div>
          ))
        }
      </List>
      )}
  </div>);
  }
}
export default withStyles(styles)(EventDetail);
