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
import Menu, { MenuItem , MenuList} from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Grow from 'material-ui/transitions/Grow';

const styles= theme => ({

})
// const options = [
//   'None',
//   'Atria',
//   'Callisto',
//   'Dione',
//   'Ganymede',
//   'Hangouts Call',
//   'Luna',
//   'Oberon',
//   'Phobos',
//   'Pyxis',
//   'Sedna',
//   'Titania',
//   'Triton',
//   'Umbriel',
// ];

const ITEM_HEIGHT = 48;
@observer
class EventsList extends React.Component{
  state = {
    anchorEl: [],
  };

  handleClick = (event , item_id) => {
    const anchor = this.state.anchorEl;
    anchor[item_id]= event.currentTarget;

    // update state
    this.setState({
      anchorEl:anchor,
    });
  };

  handleCloseMenu = (item_id) => {
    const anchor = this.state.anchorEl;
    anchor[item_id]= null;

    // update state
    this.setState({
      anchorEl:anchor,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  constructor(props){
    super(props);
    this.state = {
        open: false,
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
  componentDidMount=()=>{
    let arr =[]
    EventStore.unfiltered_events.map((item) => {
      i = item._id
      arr[i] = null
    })
    this.setState({
      anchorEl:arr
    })
  }
  handleAddEvent =(event)=>{
    this.setState({ open: true });

  }
  handleEditEvent=(event , item)=>{
    form.update({
      "title":item.title,
      "type": item.type, 
      "place": item.place,
      "start_date": item.start_date,
      "end_date": item.end_date,
      "_id": item._id 

    });
    this.setState({ open: true });
     
  }
  eventDetail=(item)=>{
    EventStore.selectEvent(item);
    this.props.history.push(`/manage-single-event/${item._id}`);
  }
  deleteEvent=(eventid)=>{
    EventStore.deleteEvent(eventid);
  }
  addEventOperation=(e)=>{
    form.onSubmit(e)
    this.handleClose()
  }
  render(){
    const { from, to, anchorEl } = this.state;
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
            <Button onClick={(e)=>this.addEventOperation(e)} color="secondary">
              حفظ
            </Button>
            <Button onClick={this.handleClose} >
            إلغاء
            </Button>
          </DialogActions>
        </Dialog>

	     <ul className="event-list">
         {EventStore.unfiltered_events.map((item) => (
           <Grow in={true}>
            <li key={item._id}>
						<time dateTime="2014-07-20" onClick={() => {this.eventDetail(item)}}>
							<span className="day">{dateFormat(item.start_date , 'dd')}</span>
							<span className="month">{dateFormat(item.start_date , 'mmm')}</span>
							<span className="year">{dateFormat(item.start_date , 'yyyy')}</span>
						</time>
						<div className="info" onClick={() => {this.eventDetail(item)}}>
							<h2 className="titre">{item.title}</h2>
              <p className="type"> {item.type} </p>
              <p className="emplacement"> {item.place}</p>
              <p className="desc"> من  {dateFormat(item.start_date , 'dd/mm/yyyy')} , {dateFormat(item.start_date , 'hh:mm')} الى {dateFormat(item.end_date , 'dd/mm/yyyy')} , {dateFormat(item.end_date , 'hh:mm')}</p>
              <p className="desc"><AccountCircle className="accountIcon"/> الحضور المتوقع {item.numberAttendies}</p>
            </div>

          <div>
            <IconButton
              aria-label="More"
              aria-owns={anchorEl[item._id] ? 'long-menu' : null}
              aria-haspopup="true"
              onClick={(event)=>this.handleClick(event , item._id)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={this.state.anchorEl[item._id]}
              open={Boolean(anchorEl[item._id])}
              onClose={()=>this.handleCloseMenu(item._id)}

            >
                <MenuItem  onClick={(event)=>this.handleEditEvent(event , item)}> Edit Event </MenuItem>
                <MenuItem  onClick={()=>this.deleteEvent(item._id)}> Archive Event </MenuItem>
            </Menu>
          </div>
					</li>
        </Grow>
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
