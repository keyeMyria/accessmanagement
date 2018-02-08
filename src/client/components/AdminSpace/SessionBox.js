import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import AgentCard from './AgentCard';
import moment from 'moment'

class SessionBox extends Component {
	constructor(props) {
			super(props);
			this.state = {
							cards: props.list ,
							data:props.data
						};
						console.log(props.data)
		}
		pushCard(card) {
		this.setState(update(this.state, {
			cards: {
				$push: [ card ]
			}
		}));
	}

	removeCard(index) {
		this.setState(update(this.state, {
			cards: {
				$splice: [
					[index, 1]
				]
			}
		}));
	}

	moveCard(dragIndex, hoverIndex) {
		const { cards } = this.state;
		const dragCard = cards[dragIndex];
		this.setState(update(this.state, {
			cards: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard]
				]
			}
		}));
	}

	render() {
		const { cards,data } = this.state;
		const { canDrop, isOver, connectDropTarget} = this.props;
		const isActive = canDrop && isOver;
		const style = {
			width: "350px",
			border: '2px solid #dcdcdc' ,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '10px',
			marginLeft: '10px',
		};
		const textStyle = {
			alignSelf: 'flex-start',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
		};
		const titleBox ={
			color: '#003489',
			fontFamily: 'Changa, sans-serif',
			fontSize: '12pt',
    	marginRight: '14px',
		};
		const descBox ={
			color: 'rgba(88, 88, 88, 0.72)',
			fontFamily: 'Changa, sans-serif',
			fontSize: '9pt',
			alignSelf: 'flex-start',
			marginRight: '14px',
		};
		const backgroundColor = isActive ? '#00abc780' : '#eee';
		const borderColor = isActive ? '#00abc7' : '#dcdcdc';

		return connectDropTarget(
			<div style={{...style, backgroundColor, borderColor}}>
			{(data==null)&&(
				<div style={{...textStyle}}>
					<p style={{...titleBox}}>قائمة الوكلاء</p>
					<p style={{...descBox}}>اسحب واسقط وكيل الى الدورةالمطلوبة </p>
				</div>
		)}
				{(data!=null && data.workshop==null)&&(
					<div style={{...textStyle}}>
						<p style={{...titleBox}}>جلسة عامة</p>
						<p style={{...descBox}}> بدأت الجلسة على الساعة {moment(data.start_hour).utcOffset(1, true).format('hh:mm')}</p>
					</div>
				)}
				{(data!=null && data.workshop!=null)&&(
					<div style={{...textStyle}}>
						<p style={{...titleBox}}>{data.workshop.name}</p>
						<p style={{...descBox}}>  بدأت الجلسة على الساعة  {moment(data.start_hour).utcOffset(1, true).format('hh:mm')}</p>
					</div>
				)}
				{cards.map((card, i) => {
					return (
						<AgentCard
							key={card._id}
							data ={card}
							index={i}
							listId={this.props._id}
							card={card}
							removeCard={this.removeCard.bind(this)}
							moveCard={this.moveCard.bind(this)}/>
					);
				})}
			</div>
		);
	}
}
const cardTarget = {
	drop(props, monitor, component ) {
		const { _id } = props;
		const sourceObj = monitor.getItem();
		if ( _id !== sourceObj.listId ) component.pushCard(sourceObj.card);
		return {
			listId: _id
		};
	}
}

export default DropTarget("AgentCard", cardTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))(SessionBox);
