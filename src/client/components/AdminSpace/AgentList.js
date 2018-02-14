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
import SessionStore from '../../mobx/sessionstore';
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import SessionBox from './SessionBox'

const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  IN:{
    // fill :"#00B0FF",
    // '-webkit-transform': 'rotateY(180deg)',
    // '-moz-transform': 'rotateY(180deg)',
    // '-ms-transform': 'rotateY(180deg)',
    // '-o-transform': 'rotateY(180deg)',
    // 'transform': 'rotateY(180deg)',

  },
  OUT:{
    fill :"red",
  } ,
  wrapper :{
    height: '100%',
    padding: '15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    },
});
const sessions =[];
const agents = [];
@DragDropContext(HTML5Backend)
@observer
class AgentList extends React.Component {
constructor(props){
  super(props)
  this.state={
    sessions : sessions ,
    boxes : agents ,
    droppedBoxNames: []

  }
  sessions.length=0 ;
  agents.length=0;
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
  })
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

}
  componentDidMount=()=>{

    console.log(sessions , agents)
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
        return(<div className={classes.root}><CircularProgress color="primary" /></div>);
        else if (this.props.data.agentusers==null || Object.keys(this.props.data.agentusers).length === 0) {
            return (
                <div className={classes.root}>
                  <Paper elevation={4}>
                   <Typography type="body1" component="h3">
                     NoBody has presented his pass yet
                   </Typography>
                   <Typography type="subheader" component="p">
                     Use the capture code to register the entry and the exit of the participants
                   </Typography>
                 </Paper>
                </div>
              );
    }
    else{
      const { boxes, sessions } = this.state
        return (
          <div>
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

    			</div>
          )
    }
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
