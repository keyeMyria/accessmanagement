import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {red , lightblue} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import AgentCard from './AgentCard';
import { CircularProgress } from 'material-ui/Progress';
import  {PieChart, Pie, Legend} from 'recharts';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import {observer } from 'mobx-react';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import SessionStore from '../../mobx/sessionstore';
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import SessionBox from './SessionBox'
import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';
import AddAgentDialog from '../Dialogs/AddAgent'
import form from '../../mobx/forms/addAgents'
import './vendor/events.css';
import EmptyAgentsListIcon from '../App/EmptyAgentsList.svg';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';



const styles = theme => ({
  root: {
    width: '100%',
  },
  wrapper :{
    // height: '100%',
    padding: '15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
    addButton:{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
  },
  progressCircle:{
    margin: '16px 0 0 0',
},
});
const sessions =[];
const agents = [];
const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: TouchBackend({enableMouseEvents: true}), // Note that you can call your backends with options
      preview: true,
      transition: TouchTransition
    }
  ]
};
@DragDropContext(MultiBackend(HTML5toTouch))
@observer
class AgentList extends React.Component {
constructor(props){
  super(props)
  this.state={
    sessions : sessions ,
    boxes : agents ,
    droppedBoxNames: [] ,
    open : false

  }
  sessions.length=0 ;
  agents.length=0;
  this.initAgentBoxes();

}
initAgentBoxes=()=>{
  SessionStore.getUnaffectedAgents().then(res=>{
    res.data.getUnaffectedAgents.map(agent=>{
      agents.push(agent);
    })
    sessions.push({
      data : null ,
      _id : 'default',
      list : agents ,
      lastDroppedItem: null
    })
    this.setState({
      boxes : agents
    })
  }).then(res=>{
    SessionStore.getSessions().then(res=>{

      res.data.getActiveSessions.map(item=>{
        let list =[] ;
        item.agents.map(agent=>{
          list.push(agent);
        })
        sessions.push({lastDroppedItem: null , list :list , _id : item._id , data : item})
      });
      this.setState({
        sessions: sessions
      })
    })
  })

}
addUnaffectedAgentBox =(data)=>{
  sessions[0].push(data);
  this.setState({
    sessions:sessions
  })
}
    isDropped(boxName) {
        return this.state.droppedBoxNames.findIndex(item => boxName === item._id ) > -1
    	}
    handleDrop(index, item) {
  		const { name } = item
  		const droppedBoxNames = name ? { $push: [name] } : {}

  		this.setState(
  			update(this.state, {
  				sessions: {
  					[index]: {
  						lastDroppedItem: {
  							$set: item,
  						},
  					},
  				},
  				droppedBoxNames,
  			}),
  		)
  	}
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
    }
    handleCloseDialog=()=>{
      this.setState({
        open:false
      })
    }
    handleAddAgent =(event)=>{
      this.setState({ open: true });

    }
    filterList =(event)=>{
      var updatedList = this.state.attendies_list;
      updatedList = updatedList.filter(function(item){
        return item.name.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
      });
      this.setState({attendies_list: updatedList});
    }
    render() {
      const { classes } = this.props;
      if(this.props.data.loading==true)
        return(<div className={classes.root}><CircularProgress color="primary" className={classes.progressCircle}/></div>);
        else if (this.props.data.agentusers==null || Object.keys(this.props.data.agentusers).length === 0) {
            return (
              <div className={classes.root} className="emptyStatus">
                <div className="emptyStatusIcon">
                <EmptyAgentsListIcon/>
                </div>
                 <h3 className="emptyStatusTitle">
                   لم يتم تعيين اي وكيل على المدخل
                </h3>
                 <p className="emptyStatusDesciption">
                   اضغط على الزر في الاسفل لاضافة وكيل
                 </p>
                   <div>
                     {
                       
                   }
                     {
                       <Button   variant="fab"   color="secondary" aria-label="add new agentt" onClick={this.handleAddAgent} className={classes.addButton}>
                       <Add style={{
                         color:'#ffff',
                       }}/>
                     </Button>
                   }
             			</div>
                </div>
              );
    }
    else{
      const { boxes, sessions } = this.state
        return (
          <div>
            {
              <AddAgentDialog open={this.state.open} AddForm={form} successCallback={this.addUnaffectedAgentBox}/>

          }

    				<div className={classes.wrapper}>
    					{sessions.map(({lastDroppedItem  , list , _id , data }, index) => (
    						<SessionBox
    							lastDroppedItem={lastDroppedItem}
    							onDrop={item => this.handleDrop(index, item)}
                  data ={data}
                  list = {list}
                  _id={_id}
                  data={data}
    							key={index}
    						/>
    					))}
    				</div>
            {
              <Button   variant="fab"   color="secondary" aria-label="add new agent" onClick={this.handleAddAgent} className={classes.addButton}>
              <Add style={{
                color:'#ffff',
              }}/>
            </Button>
          }
    			</div>
          )
    }
}
addAgentOperation =(e)=>{
    form.onSubmit(e);
    this.handleCloseDialog();
}
}
AgentList.propTypes = {
  classes: PropTypes.object.isRequired,
};
const agentusers= gql`
  query agentusers {
    agentusers {
      _id
      username
      status
      profile{
        name
        forname
        avatar
        tel

      }
      workshop{
        _id
      }
      role{name}

    }
  }
`;

const AgentsWithData = graphql(agentusers)(AgentList);
export default withStyles(styles)(AgentsWithData);
