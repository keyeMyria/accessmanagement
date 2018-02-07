import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import AgentCard from './AgentCard'

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
			border: '1px solid gray' ,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '10px',
		};
		const titleBox ={
			color: '#003489',
			fontFamily: 'Changa, sans-serif',
			fontSize: '12pt',
			alignSelf: 'flex-start',
    	marginRight: '23px',
		};
		const descBox ={
			color: 'rgba(88, 88, 88, 0.72)',
			fontFamily: 'Changa, sans-serif',
			fontSize: '9pt',
			alignSelf: 'flex-start',
			marginRight: '23px',
		};
		const backgroundColor = isActive ? 'lightgreen' : 'rgba(222, 222, 222, 0.68)';

		return connectDropTarget(
			<div style={{...style, backgroundColor}}>
				{(data==null && data.workshop==null)&&(<p style={{...titleBox}}>قائمة الوكلاء</p>)(<p style={{...descBox}}>اسحب واسقط وكيل الى الدورةالمطلوبة </p>)}
				{(data!=null && data.workshop==null)&&(<span>Session Globale</span>)}
				{(data!=null && data.workshop!=null)&&(<span>{data.workshop.name}</span>)}
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
