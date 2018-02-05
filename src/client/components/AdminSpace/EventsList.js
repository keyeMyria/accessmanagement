import React from 'react';
import Button from 'material-ui/Button';
import AddBox from 'material-ui-icons/AddBox'
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import './vendor/events.css';
import 'react-day-picker/lib/style.css';
import form from '../../mobx/forms/addevent';
import Form from './addEventForm';
import EventStore from '../../mobx/eventstore';
import { observer } from 'mobx-react';
import dateFormat from 'dateformat';
import AccountCircle from 'material-ui-icons/AccountCircle'
import {withRouter} from 'react-router-dom';

import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import {Link} from 'react-router'
const styles= theme => ({
  date :{

  },
  description :{

  }

})

@observer
class EventsList extends React.Component{


  constructor(props){
    super(props);
    this.state = {
        open: false,
        openMenu : false,
        from: undefined,
         to: undefined,
         top: 0,
      };
    EventStore.getEvents();

  }

  handleDayClick=(day)=>{
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }
  handleResetClick=()=>{
    this.setState({
      from : undefined ,
      to : undefined
    });
  }

  handleCloseMenu = () => {
    this.setState({ openMenu: false });
  };

  handleClick = (event)=>{
    this.setState({ openMenu: true});
    var x = event.clientX;
    // var y = event.clientY;
    this.setState({top:-x});
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAddEvent =(event)=>{
    this.setState({ open: true });

  }
  eventDetail=(item)=>{
    EventStore.selectEvent(item);
    this.props.history.replace(`/manage-single-event/${item._id}`);
  }
  deleteEvent=(eventid)=>{
    EventStore.deleteEvent(eventid);
  }
  render(){
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <div>
        <div>
              <Button raised color="primary" className="button-activ">
                Current
              </Button>
              <Button raised color="contrast">
                Upcoming
              </Button>
              <Button raised color="contrast">
                closed
              </Button>
      </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add new Event</DialogTitle>
          <DialogContent>
          <Form form={form} />
          </DialogContent>
          <DialogActions>
            <Button onClick={form.onSubmit} color="primary">
              Confirm
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

	     <ul className="event-list">
         {EventStore.events.map((item) => (
            <li key={item._id}>
						<time dateTime="2014-07-20" onClick={() => {this.eventDetail(item)}}>
							<span className="day">{dateFormat(item.start_date , 'dd')}</span>
							<span className="month">{dateFormat(item.start_date , 'mmm')}</span>
							<span className="year">{dateFormat(item.start_date , 'yyyy')}</span>
						</time>
						<div className="info">
							<h2 className="title">{item.title}</h2>
              <p className="type"> {item.type} </p>
              <p className="emplacement">hotel yasmine hammamet</p>
              <p className="desc">starts at {dateFormat(item.start_date , 'dd/mm/yyyy')} : {dateFormat(item.start_date , 'hh:mm')} ends at {dateFormat(item.end_date , 'dd/mm/yyyy')} : {dateFormat(item.end_date , 'hh:mm')}</p>
              <p className="desc"><AccountCircle className="accountIcon"/>{item.numberAttendies} Attendies</p>
            </div>
            <div>
            <IconButton
                       aria-label="More"
                       aria-haspopup="true"
                       onClick={this.handleClick}
                     >
                <MoreVertIcon />
              </IconButton>
              <Menu
                    id="long-menu"
                    Close={this.handleCloseMenu}
                    open={this.state.openMenu}

                    style={{ top:this.state.top , left : -600}}
                    PaperProps={{
                                  style: {
                                          maxHeight: 100,
                                          width: 200,
                                          top:this.state.top ,
                                         },
                                 }}

                       >
                     <MenuItem onClick={this.handleCloseMenu}>
                       Edit Event
                     </MenuItem>
                     <MenuItem onClick={()=>this.deleteEvent(item._id)}>
                       Archive Event
                     </MenuItem>
              </Menu>
            </div>
					</li>
         ))}
    </ul>
    <Button fab color="accent" aria-label="add new event" onClick={this.handleAddEvent} className="addButton">
      <AddBox />
    </Button>
  </div>
    )
  }
}
export default withRouter(EventsList);
