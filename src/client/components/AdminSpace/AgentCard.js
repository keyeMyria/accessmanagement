/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import Face from 'material-ui-icons/Face';
import ShareIcon from 'material-ui-icons/Share';import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';
import Radio from 'material-ui/Radio';
import WifiIcon from 'material-ui-icons/Wifi';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import WorkShopListComponent from './WorkShopListComponent';
import { compose } from 'react-apollo';
import Divider from 'material-ui/Divider';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import UserStore from '../../mobx/gueststore';

const style = {
	width : '300px',
  height: '100px',
	// padding: '0.5rem 1rem',
	margin: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
  listStyleType: 'none',
  borderRadius:'2px',
  boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
};
const styleListe = {
	margin: '0px' ,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '10px 10px 0',
};
const profileStyle = {
  display: 'flex',
  alignItems: 'center',
};
const styleAvatar = {
    margin: '0 10px',
};

const styleListAction = {
    position: 'static',
    marginTop: '0',
};

class AgentCard extends React.Component {
  state = {
   enter :false ,
   exit : false ,
   in_out : false,
   setted : false ,
   disabled_in :false ,
   disabled_out : false,
   disabled_do : false
 };


 handleToggle = value => () => {
   const { checked } = this.state;
   const currentIndex = checked.indexOf(value);
   const newChecked = [...checked];

   if (currentIndex === -1) {
     newChecked.push(value);
   } else {
     newChecked.splice(currentIndex, 1);
   }
   this.setState({
     checked: newChecked,
   });
  };
  updateAgentFunction  = (name , _id) => (event, checked) => {
    if(name =='enter'){
      this.setState({ enter: checked ,  exit : !checked , in_out : !checked  });
    }
    if(name =='exit'){
      this.setState({ exit: checked , enter : !checked , in_out:!checked});
    }
    if(name =='in_out'){
      this.setState({ exit: !checked , enter : !checked , in_out:checked});
    }
    this.props.SwitchRoleMutation({
      variables :{
        id : _id ,
        agentfunction : name
      }
    }) .then((response) => {
        })
  };
  agentEnterCheckedControl = (value)=>{
    return (value=='agent_in')
  }
  agentExitCheckedControl = (value)=>{
    return (value=='agent_out')
  }
  agentINOUTCheckedControl = (value)=>{
    return (value=='agent_workshop')
  }
  componentDidMount=()=>{
    if(!this.state.setted)
    this.setState ({
      enter : this.agentEnterCheckedControl(this.props.data.role.name) ,
      exit : this.agentExitCheckedControl(this.props.data.role.name) ,
      in_out : this.agentINOUTCheckedControl(this.props.data.role.name),
      setted : true
    });

  }
  initSwitchers=(val)=>{
    if(val!='5a3d8b08fb6a630ce0804848'){
      this.setState({
        disabled_in:true ,
        disabled_out :true ,
        disabled_do : falsse
      })
    }else{
      this.setState({
        disabled_in:false ,
        disabled_out :false ,
        disabled_do : true
      })
    }
  }
  handleWorkshopChange =(_id) => event => {
    let val =event.target.value;
    this.props.SwitchAgentWorkshop({
      variables :{
        id : _id ,
        workshopId : val
      }
    }) .then((response) => {
        //this.initSwitchers(val)
        })


    //this.setState({ name: event.target.value });
  };

  render() {
    const {  data} = this.props;
    const { card, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;


    return connectDragSource(connectDropTarget(
      <div style={{ ...style, opacity }}>
        <ListItem  style={{ ...styleListe}}>
          <div style={{ ...profileStyle}}>
            <Avatar  style={{ ...styleAvatar}}><Face/></Avatar>
            <span>{data.username}</span>
          </div>
          <ListItemSecondaryAction style={{ ...styleListAction}}>
                {/* <WorkShopListComponent style={WorkShopListCard} handleWorkshopChange={this.handleWorkshopChange(data._id)}
                  { ...( data.workshop!=null && { value:  data.workshop._id } ) }
                    { ...( data.workshop==null && { value:0 } ) }
                  /> */}
                  <FormControlLabel
                    control={
                      <Radio
                        ref="in"
                        checked={this.state.enter}
                        onChange={this.updateAgentFunction('enter' , data._id)}
                        disabled={this.state.disabled_in}
                      />
                    }
                    label="الدخول"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={this.state.exit}
                        onChange={this.updateAgentFunction('exit' , data._id)}
                        disabled ={this.state.disable_out}
                      />

                    }
                    label="الخروج"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={this.state.in_out}
                        onChange={this.updateAgentFunction('in_out' , data._id)}
                        disabled ={this.state.disable_do}
                      />

                    }
                    label="in/out"
                  />
          </ListItemSecondaryAction>

        </ListItem>

      </div>
    ));
  }
}
const cardSource = {

	beginDrag(props) {
		return {
			index: props.index,
			listId: props.listId,
			card: props.card
		};
	},

	endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();
		if ( dropResult && dropResult.listId !== item.listId ) {
      //console.log(item , dropResult)
      UserStore.affectUserToSession(item.card._id , dropResult.listId)
			props.removeCard(item.index);

		}
	}
};

const cardTarget = {

	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;
		const sourceListId = monitor.getItem().listId;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		if ( props.listId === sourceListId ) {
			props.moveCard(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			monitor.getItem().index = hoverIndex;
		}
	}
};

const SwitchRoleMutation = gql`
  mutation SwitchAgentRole($id: ID!, $agentfunction: String!) {
    SwitchAgentRole(id: $id, agentfunction: $agentfunction) {
      id
    }
  }
`;
const SwitchAgentWorkshop = gql`
  mutation SwitchAgentWorkshop($id :ID! , $workshopId :ID!){
    SwitchAgentWorkshop(id:$id , workshopId : $workshopId) {
      id
      username
    }
  }
`;

const AgentCardWithMutation = compose(
 graphql(SwitchRoleMutation, {
   name : 'SwitchRoleMutation'}),
 graphql(SwitchAgentWorkshop, {
   name: 'SwitchAgentWorkshop'
 })
)(AgentCard);

export default flow(
	DropTarget("AgentCard", cardTarget, connect => ({
		connectDropTarget: connect.dropTarget()
	})),
	DragSource("AgentCard", cardSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}))
)(AgentCardWithMutation);
