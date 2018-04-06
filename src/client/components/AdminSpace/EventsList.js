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
import EventCard from './EventCard';
const styles = (theme) => ({});
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
class EventsList extends React.Component {
	handleClose = () => {
		this.setState({ open: false });
	};

	constructor(props) {
		super(props);
		this.state = {
			open: false,
			from: undefined,
			to: undefined
		};
		EventStore.getEvents();
	}

	handleDayClick = (day) => {
		const range = DateUtils.addDayToRange(day, this.state);
		this.setState(range);
	};
	handleResetClick = () => {
		this.setState({
			from: undefined,
			to: undefined
		});
	};
	filterEventByCurrentDate = (type) => {
		EventStore.filterEventByCurrentDate(type);
	};
	// componentDidMount=()=>{
	//   let arr =[]
	//   EventStore.unfiltered_events.map((item) => {
	//     i = item._id
	//     arr[i] = null
	//   })
	//   this.setState({
	//     anchorEl:arr
	//   })
	// }
	handleAddEvent = (event) => {
		this.setState({ open: true });
	};
  openDialog=()=>{

    this.setState({ open: true });
  }

	deleteEvent = (eventid) => {
		EventStore.deleteEvent(eventid);
	};
	addEventOperation = (e) => {
		form.onSubmit(e);
		this.handleClose();
	};
	render() {
		const { from, to } = this.state;
		const modifiers = { start: from, end: to };
		return (
			<div>
				<div className="Btns-filter">
					<Button className="filter-activ" onClick={() => this.filterEventByCurrentDate('current')}>
						الحالي
					</Button>
					<Button color="secondary" onClick={() => this.filterEventByCurrentDate('coming')}>
						المقبل
					</Button>
					<Button color="secondary" onClick={() => this.filterEventByCurrentDate('done')}>
						الفارط
					</Button>
				</div>
				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">إضافة حدث جديد</DialogTitle>
					<DialogContent className="dialogContent">
						<Form form={form} />
					</DialogContent>
					<DialogActions>
						<Button onClick={(e) => this.addEventOperation(e)} color="secondary">
							حفظ
						</Button>
						<Button onClick={this.handleClose}>إلغاء</Button>
					</DialogActions>
				</Dialog>

				<ul className="event-list">
					{EventStore.unfiltered_events.map((item) => <EventCard {...item} key={item._id} form={form} handleOpen={this.openDialog}/>)}
				</ul>
				<Button
					  variant="fab"  
					color="secondary"
					aria-label="add new event"
					onClick={this.handleAddEvent}
					className="addButton"
				>
					<Add
						style={{
							color: '#ffff'
						}}
					/>
				</Button>
			</div>
		);
	}
}
export default EventsList;
