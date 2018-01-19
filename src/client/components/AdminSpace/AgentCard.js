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
import WifiIcon from 'material-ui-icons/Wifi';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import WorkShopListComponent from './WorkShopListComponent';
import { compose } from 'react-apollo';
import Divider from 'material-ui/Divider';

const styles = theme => ({
  card: {
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
   marginRight: theme.spacing.unit,
 },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  });

  const listeAgentCard={
    textAlign: 'right',
    paddingTop: '30px',
  };
  const WorkShopListCard={
    borderLeft: '1px solid #b9b9b9',
    paddingLeft: '60px',
    top: '-5px'
  };
  const ControlLabelListCard={
      paddingRight: '40px',
  };

class AgentCard extends React.Component {
  state = {
   enter :false ,
   exit : false ,
   setted : false ,
   disabled_in :false ,
   disabled_out : false
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
      this.setState({ enter: checked ,  exit : !checked  });
    }
    if(name =='exit'){
      this.setState({ exit: checked , enter : !checked});
    }
    this.props.SwitchRoleMutation({
      variables :{
        id : _id ,
        agentfunction : name
      }
    }) .then((response) => {
        console.log(response)
        })
  };
  agentEnterCheckedControl = (value)=>{
    return (value=='agent_in')
  }
  agentExitCheckedControl = (value)=>{
    return (value=='agent_out')
  }
  componentDidMount=()=>{
    if(!this.state.setted)
    this.setState ({
      enter : this.agentEnterCheckedControl(this.props.data.role.name) ,
      exit : this.agentExitCheckedControl(this.props.data.role.name) ,
      setted : true
    });

  }
  initSwitchers=(val)=>{
    if(val!='5a3d8b08fb6a630ce0804848'){
      this.setState({
        disabled_in:true ,
        disabled_out :true
      })
    }else{
      this.setState({
        disabled_in:false ,
        disabled_out :false
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
        this.initSwitchers(val)
        })


    //this.setState({ name: event.target.value });
  };

  render() {
    const { classes , data} = this.props;
    return (
      <div>
        <ListItem style={listeAgentCard}>
          <ListItemIcon>
            <Avatar className={classes.avatar}><Face/></Avatar>
          </ListItemIcon>
          <ListItemText primary={`${data.username}`}/>
          <ListItemSecondaryAction>
                <WorkShopListComponent style={WorkShopListCard} handleWorkshopChange={this.handleWorkshopChange(data._id)}
                  { ...( data.workshop!=null && { value:  data.workshop._id } ) }
                    { ...( data.workshop==null && { value:0 } ) }
                  />
                  <FormControlLabel
                     style={ControlLabelListCard}
                    control={
                      <Switch
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
                      <Switch
                        ref="out"
                        checked={this.state.exit}
                        onChange={this.updateAgentFunction('exit' , data._id)}
                        disabled ={this.disable_out}
                      />
                    }
                    label="الخروج"
                  />
          </ListItemSecondaryAction>

        </ListItem>
        <Divider light />

      </div>
    );
  }
}
AgentCard.propTypes = {
  classes: PropTypes.object.isRequired,
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
export default withStyles(styles)(AgentCardWithMutation);
