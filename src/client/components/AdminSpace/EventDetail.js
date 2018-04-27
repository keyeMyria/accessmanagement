import React from 'react';
import { observer  , inject} from 'mobx-react';
import EventStore from '../../mobx/eventstore';
import WorkshopStore from '../../mobx/workshopstore';
import UserStore from '../../mobx/gueststore';
import form from '../../mobx/forms/addworkshop';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Place from 'material-ui-icons/Place';
import AccessTime from 'material-ui-icons/AccessTime';
import dateFormat from 'dateformat';
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogActions, DialogTitle, DialogContent } from 'material-ui/Dialog';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import './vendor/events.css';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Stop from 'material-ui-icons/Stop';
import Event from 'material-ui-icons/Event';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import PlayButton from './vendor/play.svg';
import LectureIcon from './vendor/lecture.svg';
//import PlayButton from './vendor/playButton.svg';
import WorkShopForm from './addWorkShopForm';
import Add from 'material-ui-icons/Add';
import formEdit from '../../mobx/forms/addevent';
import formSessionAdd from '../../mobx/forms/addSession';

import Form from './addEventForm';
import SessionForm from './addSessionForm'
const styles = (theme) => ({
	container: {},
	progressCircle: {
		margin: '16px 0 0 0'
	},
	header: {
		backgroundColor: '#053787',
		color: 'white',
		padding: '8px 16px 72px'
	},
	EventAvatar: {
		color: '#fff'
	},
	editIcon: {
		color: '#00abc7',
	},
	title: {
		margin: '16px 40px',
		fontSize: '30pt',
		lineHeight: '30pt'
	},
	dateEvent: {
		fontSize: '14pt',
		lineHeight: '24pt',
		margin: '8px'
	},
	placeEvent: {
		display:'flex',
		justifyContent:'center',
		alignItems: 'center',
		fontSize: '14pt',
		lineHeight: '24pt',
	},
	typeEvent: {
		marginTop:'8px',
		marginBottom:'8px'
	},
	chipEventType: {
		background: 'rgba(255, 255, 255, 0.14)',
    color: '#a9bad5',
	},
	appBar: {
		position: 'relative'
	},
	closeDialog: {
		color: 'white'
	},
	typoStyle: {
		flex: 1
	},
	titleDialogContent: {
		margin: '16px'
	},
	icon: {
		maxWidth: '400px',
		margin: '32px 24px 16px'
	},
	workshopform: {
		margin: '32px 16px 16px'
	},
	workshopformInputs: {
		maxWidth: '600px'
	},
	sessionItem: {
		borderLeft: '3px solid #053787',
		minHeight: '80px',
		display: 'flex',
		justifyContent: 'space-between'
	},
	datEntreSorti: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	containerWorkshop: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '-24px',
		marginBottom: '8px'
	},
	listWorkshop: {
		width: '90vw',
		maxWidth: '700px',
		backgroundColor: 'rgb(255, 255, 255)',
		boxShadow: '0 1px 4px 0 rgba(0,0,0,.14)',
		marginBottom: '20px'
	},
	workshopItem: {
		borderLeft: '3px solid #00ABC7',
		minHeight: '80px'
	},
	startStopSession: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	star: {
		color: '#00abc7'
	},
	stop: {
		color: '#ef4035'
	},
	sessionListWork: {
		paddingTop: '0px',
		paddingBottom: '0px',
		marginTop: '0px'
	},
	generalSessionitem: {
		minHeight: '30px',
		padding: '8px 8px 8px 0px'
	},
	workshopsessionitem: {
		borderLeft: '3px solid #00ABC7',
		backgroundColor: '#F7F7F7',
		minHeight: '30px',
		padding: '8px 24px 8px 8px'
	},
	sessionitemTime: {
		display: 'flex',
		alignItems: 'baseline',
		fontFamily: 'Roboto, Arial, sans-serif',
		fontSize: '1rem',
		fontWeight: '300',
		color: 'rgba(0, 0, 0, 0.54)'
	},
	sessionitemTimeIcon: {
		color: '#a0a0a0',
		height: '16px',
		width: '16px',
		marginRight: '3px'
	},
	sessionitemTimeEnd: {
		marginLeft: '8px'
	},
	AddButton: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	userItem: {
		width: '50%',
		float: 'right'
	},
	numberAttend: {
		display: 'flex',
		justifyContent: 'center'
	}
});
function Transition(props) {
	return <Slide direction="up" {...props} />;
}
@inject('EventStore')
@observer
class EventDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			open_workshop: false,
			open_edit_event: false
    };
		props.handleEventDashboardBottomBarElements(props.match.params.id);
		WorkshopStore.getWorkshopsForEvent(props.match.params.id);
		UserStore.getUsers();
		WorkshopStore.setSelectedWorkShopEvent(props.match.params.id);
		props.EventStore.setEventId(props.match.params.id);
		props.EventStore.getFullEventDetailsByID(props.match.params.id);
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};
	handleClickOpenEditEvent = () => {
		formEdit.update({
			title: EventStore.selectedEvent.title,
			type: EventStore.selectedEvent.type,
			place: EventStore.selectedEvent.place,
			start_date: EventStore.selectedEvent.start_date,
			end_date: EventStore.selectedEvent.end_date,
			_id: EventStore.selectedEvent._id
		});
		this.setState({
			open_edit_event: true
		});
	};
	addEventOperation = (e) => {
		formEdit.onSubmit(e);
		this.handleClickOpenEditEvent();
	};
	handleClickCloseEditEvent = () => {
		this.setState({
			open_edit_event: false
		});
	};
	handleClickOpenWorkshop = () => {
		this.setState({ open_workshop: true });
	};
	handleClose = () => {
		this.setState({ open: false });
	};
	handleCloseWorkshop = () => {
		this.setState({ open_workshop: false });
	};

	startSessionAction = () => {
		EventStore.startSessionForEvent(this.props.match.params.id);
		this.handleClose();
	};
	stopSessionAction = (sessionid) => {
		EventStore.stopSessionForEvent(sessionid, this.props.match.params.id);
	};
	startSessionForWorkshop = (workshopid) => {
		WorkshopStore.addNewSessionForWorkShop(workshopid);
	};
	stopSessionForWorkShop = (workshopid) => {
		WorkshopStore.stopSessionForWorkShop(workshopid);
	};
	handleSubmitAddWorkshop = (event, form) => {
		form.onSubmit(event);
		this.handleCloseWorkshop();
		WorkshopStore.getWorkshopsForEvent(this.props.match.params.id);
	};
	handleAddSessionForEvent=(event , form)=>{
		form.onSubmit(event);
		this.handleClose();
		this.props.EventStore.getFullEventDetailsByID(this.props.match.params.id);

	}
	render() {
		const workshoplist = WorkshopStore.workshops;
		 event = EventStore.selectedEvent
		const { classes } = this.props;
		if (EventStore.selectedEvent == undefined) {
			return (
				<div>
					<CircularProgress color="primary" className={classes.progressCircle} />
				</div>
			);
		}
		else{
			return (
				<div>
					<Dialog
						open={this.state.open_edit_event}
						onClose={this.handleClose}
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">تحديث يبانات الحدث</DialogTitle>
						<DialogContent className="dialogContent">
							<Form form={formEdit} />
						</DialogContent>
						<DialogActions>
							<Button onClick={(e) => this.addEventOperation(e)} color="secondary">
								حفظ
							</Button>
							<Button onClick={this.handleClose}>إلغاء</Button>
						</DialogActions>
					</Dialog>

					<Dialog fullScreen open={this.state.open} onClose={this.handleClose} transition={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton onClick={this.handleClose} aria-label="Close">
									<CloseIcon className={classes.closeDialog} />
								</IconButton>
								<Typography type="title" color="inherit" className={classes.typoStyle}>
									تسجيل جلسة عامة جديدة
								</Typography>
							</Toolbar>
						</AppBar>
						<div>
							<PlayButton className={classes.icon} />
							<SessionForm form={formSessionAdd} eventid={EventStore.selectedEvent._id} />
						</div>
						<DialogActions>
							<Button raised="true" color="secondary" onClick={(e)=>this.handleAddSessionForEvent(e ,formSessionAdd)}>
								تسجيل
							</Button>
							<Button onClick={this.handleClose}>إلغاء</Button>
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
									<CloseIcon className={classes.closeDialog} />
								</IconButton>
								<Typography type="title" color="inherit" className={classes.typoStyle}>
									إضافة ورشة عمل جديدة
								</Typography>
							</Toolbar>
						</AppBar>
						<div className={classes.workshopform}>
							<LectureIcon className={classes.icon} />
							<WorkShopForm
								className={classes.workshopformInputs}
								form={form}
								users={UserStore.users}
								onSuccess={this.handleClose}
							/>
						</div>
						<DialogActions>
							<Button
								raised="true"
								onClick={(e) => this.handleSubmitAddWorkshop(e, form)}
								color="secondary"
							>
								إضافة
							</Button>
							<Button onClick={this.handleCloseWorkshop}>إلغاء</Button>
						</DialogActions>
					</Dialog>

					<div className={classes.container}>
						<div className={classes.header}>
							<div className={classes.headerContent}>
							<Button className="editButton" onClick={this.handleClickOpenEditEvent} fab >
								<ModeEditIcon className={classes.editIcon} />
							</Button>
							<h2 className={classes.title}>{EventStore.selectedEvent.title}</h2>
							<p className={classes.dateEvent}>
								{`من : ${dateFormat(EventStore.selectedEvent.start_date, 'dd/mm/yyyy')}`}{' '}
								{`، الى : ${dateFormat(EventStore.selectedEvent.end_date, 'dd/mm/yyyy')}`}
							</p>
							<div className={classes.placeEvent}>
								<Place style={{opacity:'0.5'}}/>
								<p>{EventStore.selectedEvent.place}</p>
							</div>
							<div className={classes.typeEvent}>
								<Chip label={EventStore.selectedEvent.type} className={classes.chipEventType} />
							</div>
							<p className={classes.numberAttend}>
								{' '}<AccountCircle style={{opacity:'0.5', marginLeft: '5px',}}/>
								  الحضور المتوقع{' : '}  {event.guests_number}
							</p>
						</div>
						</div>

						<Button onClick={this.handleClickOpenWorkshop} className="AddingButton">
							<div className={classes.AddButton}>
								<Add />
								إضافة ورشة عمل
							</div>
						</Button>
						{EventStore.selectedEvent.session_empty && (
							<Button onClick={this.handleClickOpen} className="AddingButton">
								<div className={classes.AddButton}>
									<PlayArrow />
									تسجيل جلسة عامة
								</div>
							</Button>
						)}
						{EventStore.selectedEvent.session_empty == null && (
							<Button onClick={this.handleClickOpen} className="AddingButton">
								<div className={classes.AddButton}>
									<Add />
									Add Session
								</div>
							</Button>
						)}
						{EventStore.selectedEvent.session_collection !== undefined && (
							<List className={classes.containerWorkshop}>
								{EventStore.selectedEvent.session_collection.map((item) => (
									<div key={item._id} className={classes.listWorkshop}>
										<ListItem className={classes.sessionItem}>
											<div className={classes.datEntreSorti}>
												<ListItemText primary={item.title} />
												<div className={classes.generalSessionitem}>
													<div className={classes.sessionitemTime}>
														<div>
															<AccessTime className={classes.sessionitemTimeIcon} />
															{` أفتتحت من الساعة ${dateFormat(item.start_hour, 'HH:mm')} `}
														</div>
														{item.stat == 'OFF' && (
															<div className={classes.sessionitemTimeEnd}>
															{` اغلقت على الساعة ${dateFormat(item.end_hour,'HH:mm')}`}
															</div>
														)}
													</div>
												</div>
											</div>

											{item.stat == 'ON' && (
												<Button
													onClick={() => this.stopSessionAction(item._id)}
													className={classes.stop}>
													<div className={classes.startStopSession}>
														<Stop />
														إنهاء الجلسة
													</div>
												</Button>
											)}
										</ListItem>
									</div>
								))}
							</List>
						)}
						{workshoplist !== undefined && (
							<List className={classes.containerWorkshop}>
								{workshoplist.map((item) => (
									<div key={item._id} className={classes.listWorkshop}>
										<ListItem className={classes.workshopItem}>
											<ListItemText primary={item.name} />
											{item.session_empty == true &&(
												<Button
													onClick={() => this.startSessionForWorkshop(item._id)}
													className={classes.star}>
													<div className={classes.startStopSession}>
														<PlayArrow />
														تسجيل جلسة
													</div>
												</Button>
											)}
											{ `${item._id}_load` ==true &&(<div className={classes.startStopSession}>
														<CircularProgress
															className={classes.progressCircle}
															color="primary"
														/>
													</div>)}
											{item.session_empty == null && (
												<Button
													onClick={() => this.startSessionForWorkshop(item._id)}
													className={classes.star}
												>
													<div className={classes.startStopSession}>
														<PlayArrow />
														تسجيل جلسة
													</div>
												</Button>
											)}
											{item.session_empty == false && (
												<Button
													onClick={() => this.stopSessionForWorkShop(item._id)}
													className={classes.stop}
												>
													<div className={classes.startStopSession}>
														<Stop />
														إنهاء الجلسة
													</div>
												</Button>
											)}
										</ListItem>
										<List className={classes.sessionListWork}>
											{item.session_list!=undefined && item.session_list.map((lol) => (
												<div key={lol._id}>
													<div className={classes.workshopsessionitem}>
														<div className={classes.sessionitemTime}>
															<div>
																<AccessTime className={classes.sessionitemTimeIcon} />
																{`التوقيت : من ${dateFormat(lol.start_hour, 'HH:mm')}`}
															</div>
															{lol.stat == 'OFF' && (
																<div
																	className={classes.sessionitemTimeEnd}
																>{`الى ${dateFormat(lol.end_hour, 'HH:mm')}`}</div>
															)}
														</div>
													</div>
												</div>
											))}
										</List>
									</div>
								))}
							</List>
						)}
					</div>
				</div>
			);
		}

	}
}
export default withStyles(styles)(EventDetail);
