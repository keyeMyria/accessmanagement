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
import DeleteIcon from 'material-ui-icons/Delete';

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
        <div>
              <Button raised color="primary">
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
							<span className="time">{dateFormat(item.start_date , 'hh:mm')}</span>
						</time>
						<img alt="Independence Day" src="https://farm4.staticflickr.com/3100/2693171833_3545fb852c_q.jpg" />
						<div className="info">
							<h2 className="title">{item.title}</h2>
              <p className="desc">{item.type}</p>
              <p className="desc">starts at {dateFormat(item.start_date , 'dd/mm/yyyy')} : {dateFormat(item.start_date , 'hh:mm')}</p>
              <p className="desc">ends at {dateFormat(item.end_date , 'dd/mm/yyyy')} : {dateFormat(item.end_date , 'hh:mm')}</p>
              <p><AccountCircle/>{item.numberAttendies} Attendies</p></div>
              <div className="info">
              <Button fab mini aria-label="delete" onClick={()=>this.deleteEvent(item._id)}>
                <DeleteIcon />
              </Button>
						</div>

					</li>
         ))}
    </ul>
    <Button fab color="accent" aria-label="add new event" onClick={this.handleAddEvent}>
      <AddBox />
    </Button>
  </div>
    )
  }
}
export default withRouter(EventsList);
