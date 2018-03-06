import React from 'react';
import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';
import green from 'material-ui/colors/green';

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

const styles= theme => ({

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
  filterEventByCurrentDate =(type)=>{
    console.log(type)
    EventStore.filterEventByCurrentDate(type);
  }
  handleCloseMenu = () => {
    this.setState({ openMenu: false });
  };

  handleClick = (event)=>{
   this.setState({ openMenu: true});
    var x = event.clientX;
    var y = event.clientY;
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
    this.props.history.push(`/manage-single-event/${item._id}`);
  }
  deleteEvent=(eventid)=>{
    EventStore.deleteEvent(eventid);
  }
  render(){
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <div>
        <div className="Btns-filter">
              <Button  className="filter-activ" onClick={()=>this.filterEventByCurrentDate("current")}>
                الحالي
              </Button>
              <Button color="secondary" onClick={()=>this.filterEventByCurrentDate("coming")}>
                المقبل
              </Button>
              <Button color="secondary" onClick={()=>this.filterEventByCurrentDate("done")}>
                الفارط
              </Button>
      </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">إضافة حدث جديد</DialogTitle>
          <DialogContent className="dialogContent">
          <Form form={form}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={form.onSubmit} color="secondary">
              حفظ
            </Button>
            <Button onClick={this.handleClose} >
            إلغاء
            </Button>
          </DialogActions>
        </Dialog>

	     <ul className="event-list">
         {EventStore.unfiltered_events.map((item) => (
            <li key={item._id}>
						<time dateTime="2014-07-20" onClick={() => {this.eventDetail(item)}}>
							<span className="day">{dateFormat(item.start_date , 'dd')}</span>
							<span className="month">{dateFormat(item.start_date , 'mmm')}</span>
							<span className="year">{dateFormat(item.start_date , 'yyyy')}</span>
						</time>
						<div className="info" onClick={() => {this.eventDetail(item)}}>
							<h2 className="titre">{item.title}</h2>
              <p className="type"> {item.type} </p>
              <p className="emplacement"> Hotel Yasmine Hammamet</p>
              <p className="desc"> من  {dateFormat(item.start_date , 'dd/mm/yyyy')} , {dateFormat(item.start_date , 'hh:mm')} الى {dateFormat(item.end_date , 'dd/mm/yyyy')} , {dateFormat(item.end_date , 'hh:mm')}</p>
              <p className="desc"><AccountCircle className="accountIcon"/> الحضور المتوقع {item.numberAttendies}</p>
            </div>
            <div>
            <IconButton
                       aria-label="More"
                       aria-haspopup="true"
                       onClick={this.handleClick}
                     >
                <MoreVertIcon />
              </IconButton>
              {console.log(this.state.top)}
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
    <Button fab  color="secondary" aria-label="add new event" onClick={this.handleAddEvent} className="addButton">
      <Add style={{
        color:'#ffff',
      }}/>
    </Button>
  </div>
    )
  }
}
export default withRouter(EventsList);
