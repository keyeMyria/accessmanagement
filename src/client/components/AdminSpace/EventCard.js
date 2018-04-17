import React from 'react';

import Menu, { MenuItem, MenuList } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Chip from 'material-ui/Chip';
import Grow from 'material-ui/transitions/Grow';
import dateFormat from 'dateformat';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Place from 'material-ui-icons/Place';
import './vendor/events.css';
import { withRouter } from 'react-router-dom';
import EventStore from '../../mobx/eventstore';
import { observer } from 'mobx-react';
@observer
class EventCard extends React.Component {
    state = {
        anchorEl: null,
      };

      handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
      };

      handleClose = () => {
        this.setState({ anchorEl: null });
      };
      handleEditEvent = (item) => {
          console.log(this.props)
		this.props.form.update({
			title: item.title,
			type: item.type,
			place: item.place,
			start_date: item.start_date,
			end_date: item.end_date,
			_id: item._id
        });
        this.props.handleOpen()
	};

	eventDetail = (item) => {
		EventStore.selectEvent(item);
		this.props.history.push(`/manage-single-event/${item._id}`);
	};
	render() {
		const { anchorEl } = this.state;
		return (
			<Grow in={true}>
				<li>
					<time
						dateTime="2014-07-20"
						onClick={() => {
							this.eventDetail(this.props);
						}}
					>
						<span className="day">{dateFormat(this.props.start_date, 'dd')}</span>
						<span className="month">{dateFormat(this.props.start_date, 'mmm')}</span>
						<span className="year">{dateFormat(this.props.start_date, 'yyyy')}</span>
					</time>
					<div
						className="info"
						onClick={() => {
							this.eventDetail(this.props);
						}}
					>
						<h2 className="titre">{this.props.title}</h2>
						<p className="desc">
							{' '}
							من {dateFormat(this.props.start_date, 'dd/mm/yyyy')} ,{' '}
							{dateFormat(this.props.start_date, 'HH:mm')} الى{' '}
							{dateFormat(this.props.end_date, 'dd/mm/yyyy')} , {dateFormat(this.props.end_date, 'HH:mm')}
						</p>
            <p className="emplacement"> <Place color="disabled" /> {this.props.place}</p>
            <Chip label={this.props.type} className="type" />
						<p className="desc">
							<AccountCircle className="accountIcon" /> الحضور المتوقع {this.props.guests_number}
						</p>
					</div>

					<div>
						<IconButton
							aria-label="More"
							aria-owns={anchorEl ? `long-menu${this.props._id}` : null}
							aria-haspopup="true"
                            onClick={this.handleClick}
						>
							<MoreVertIcon />
						</IconButton>
						 <Menu
						id={`long-menu${this.props._id}`}
                        anchorEl={this.state.anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
					>
						<MenuItem onClick={() => this.handleEditEvent(this.props)}> Edit Event </MenuItem>
						<MenuItem onClick={() => this.deleteEvent(this.props._id)}> Archive Event </MenuItem>
					</Menu>
					</div>
				</li>
			</Grow>
		);
	}
}

export default withRouter(EventCard);
