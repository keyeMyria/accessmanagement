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
import AccountCircle from 'material-ui-icons/AccountCircle';
import dateFormat from 'dateformat';
import { withStyles } from 'material-ui/styles';
import Dialog , {DialogActions} from 'material-ui/Dialog';
import List, { ListItem, ListItemText , ListItemSecondaryAction } from 'material-ui/List';
import './vendor/events.css';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Stop from 'material-ui-icons/Stop';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import PlayButton from './vendor/play.svg';
import LectureIcon from './vendor/lecture.svg';
//import PlayButton from './vendor/playButton.svg';
import WorkShopForm from './addWorkShopForm';
import Add from 'material-ui-icons/Add'
const styles = theme => ({
  editButton:{
    marginBottom: '10px',
    backgroundColor:'#fff',
  },
  container:{
  },
  header: {
    backgroundColor : '#053787',
    color :'white',
    padding:'24px 16px 72px',
  } ,
  title:{
    margin: '16px 0',
    fontSize: '30pt',
  },
  dateEvent: {
    fontSize:'14pt',
    lineHeight: '24pt',
    margin:'8px',
  },
  appBar: {
    position: 'relative',
  },
  closeDialog:{
    color: 'white',
  },
  typoStyle: {
    flex: 1,
  },
  titleDialogContent: {
      margin: '16px',
    },
  icon :{
    maxWidth :'400px',
    margin:'32px 24px 16px',
  } ,
  workshopform:{
    margin:'32px 16px 16px',
  },
  sessionItem :{
    borderLeft : '3px solid #053787' ,
    minHeight : '80px',
  } ,
  containerWorkshop:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-24px',
    marginBottom: '8px',
  },
  listWorkshop:{
    width: '90vw',
    maxWidth:'700px',
    backgroundColor: 'rgb(255, 255, 255)',
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    marginBottom: '20px',
  },
  workshopItem:{
    borderLeft : '3px solid #00ABC7' ,
    minHeight : '80px',
  },
  startStopSession:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
  star:{
    color: '#00abc7',
  },
  stop:{
    color:'#ef4035',
  },
  sessionListWork:{
    paddingTop :'0px' ,
    paddingBottom : '0px',
    marginTop : '0px'
  },
  workshopsessionitem:{
    borderLeft : '16px solid #F5F5F5' ,
    backgroundColor :'#F5F5F5',
    minHeight : '30px',
  },
  AddButton:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userItem :{
    width : '50%',
    float : 'right',
  },
  numberAttend:{
    display: 'flex',
    justifyContent: 'center',
  },

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
   props.handleEventDashboardBottomBarElements(props.match.params.id)
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
   this.handleClose()
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
 handleSubmitAddWorkshop=(event , form)=>{
   form.onSubmit(event);
   this.handleCloseWorkshop()
 }
  render(){
    const event = EventStore.selectedEvent;
    const workshoplist = WorkshopStore.workshops;
    WorkshopStore.setSelectedWorkShopEvent(this.props.match.params.id);
    const {classes} = this.props;
    if(WorkshopStore.state=='loading'){
      return(
        <div><CircularProgress className={classes.progress} color="secondary" /></div>);
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
             <IconButton onClick={this.handleClose} aria-label="Close">
               <CloseIcon className={classes.closeDialog}/>
             </IconButton>
             <Typography type="title" color="inherit" className={classes.typoStyle}>
             تسجيل جلسة عامة جديدة
             </Typography>
           </Toolbar>
         </AppBar>
         <div>
           <PlayButton className={classes.icon}/>
         <Typography type="display1" className={classes.titleDialogContent}>
         جلسة عامة جديدة
         </Typography>
         </div>
         <DialogActions>
           <Button raised="true" color="secondary" onClick={this.startSessionAction}>
             تسجيل
           </Button>
           <Button onClick={this.handleClose}>
             إلغاء
           </Button>
         </DialogActions>
       </Dialog>


       <Dialog
        fullScreen
        open={this.state.open_workshop}
        onClose={this.handleCloseWorkshop}
        transition={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton onClick={this.handleCloseWorkshop} aria-label="Close">
              <CloseIcon className={classes.closeDialog}/>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.typoStyle}>
              إضافة ورشة عمل جديدة
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.workshopform}>
          <LectureIcon className={classes.icon}/>
          <WorkShopForm form={form} users={UserStore.users} onSuccess={this.handleClose}/>
        </div>
        <DialogActions>
          <Button raised="true" onClick={(event)=>this.handleSubmitAddWorkshop(event , form)} color="secondary">
            إضافة
          </Button>
          <Button onClick={this.handleCloseWorkshop}>
          إلغاء
          </Button>
        </DialogActions>
        </Dialog>

      <div className={classes.container}>
      <div className={classes.header}>
        <Button variant="fab" raised="true" color="secondary" aria-label="edit Event" className={classes.editButton}>
          <ModeEditIcon />
        </Button>
          <h2 className={classes.title}>
            {event.title}
          </h2>
          <h3>{event.type}</h3>
          <span>{event.place}</span>
          <p className={classes.dateEvent}>{`من : ${dateFormat(event.start_date , 'dd/mm/yyyy')}`}  {`، الى : ${dateFormat(event.end_date , 'dd/mm/yyyy')}`}</p>
          <p className={classes.numberAttend}> <AccountCircle/> {event.numberAttendies} الحضور المتوقع </p>
    </div>

    <Button onClick={this.handleClickOpenWorkshop} className="AddingButton">
     <div className={classes.AddButton}>
      <Add />
      إضافة ورشة عمل
      </div>
    </Button>
    {event.session_empty  &&(<Button onClick={this.handleClickOpen}  className="AddingButton">
     <div className={classes.AddButton}>
      <PlayArrow />
        تسجيل جلسة عامة
      </div>
    </Button>)}
    {event.session_empty==null  &&(<Button onClick={this.handleClickOpen} className="AddingButton">
      <div className={classes.AddButton}>
        <Add />
        Add Session
      </div>
    </Button>)}
      {(event.session_collection!==undefined)&&(
        <List className={classes.containerWorkshop}>
      {
        event.session_collection.map((item) => (
          <div  key={item._id} className={classes.listWorkshop}>
            <ListItem className={classes.sessionItem}>
            <ListItemText primary="General Session" secondary={`starts at : ${dateFormat(item.start_hour , 'hh:mm')} `} />
            {item.stat=='OFF' &&(<ListItemText secondary={`closed at : ${dateFormat(item.end_hour , 'hh:mm')}`} />
            )}
              {item.stat=='ON' &&(
                <Button onClick={()=>this.stopSessionAction(item._id)}  className={classes.stop}>
                  <div className={classes.startStopSession}>
                    <Stop/>
                    إنهاء الجلسة
                  </div>
                </Button>
              )}
            </ListItem>
        </div>
        ))
      }
    </List>)}
      {workshoplist!==undefined &&(
        <List className={classes.containerWorkshop}>
        {
          workshoplist.map((item) => (
            <div key={item._id} className={classes.listWorkshop}>
              <ListItem className={classes.workshopItem}>
              <ListItemText primary={item.name} />
                {item.session_empty==true &&(
                    <Button onClick={()=>this.startSessionForWorkshop(item._id)} className={classes.star}>
                    <div className={classes.startStopSession}>
                      <PlayArrow />
                      تسجيل جلسة
                    </div>
                    </Button>
                )}
                {item.session_empty==null &&(
                    <Button onClick={()=>this.startSessionForWorkshop(item._id)} className={classes.star}>
                    <div className={classes.startStopSession}>
                      <PlayArrow />
                      تسجيل جلسة
                      </div>
                    </Button>
                )}
                {item.session_empty==false &&(
                    <Button onClick={()=>this.stopSessionForWorkShop(item._id)}  className={classes.stop}>
                    <div className={classes.startStopSession}>
                      <Stop  color="secondary"   />
                      إنهاء الجلسة
                      </div>
                    </Button>
                )}
                </ListItem>
                  <List className={classes.sessionListWork}>
                    { item.session_list.map((lol) => (
                        <div key={lol._id}>
                          <ListItem className={classes.workshopsessionitem}>
                            <ListItemText secondary={`starts at : ${dateFormat(lol.start_hour , 'hh:mm')}`} />
                              {lol.stat=='OFF' &&(<ListItemText secondary={`closed at : ${dateFormat(lol.end_hour , 'hh:mm')}`} />
                              )}
                          </ListItem>
                        </div>
                      ))
                    }
                  </List>
          </div>
          ))
        }
      </List>
      )}
      </div>
  </div>);
  }
}
export default withStyles(styles)(EventDetail);
