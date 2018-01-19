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
const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  IN:{
    fill :"#00B0FF",
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    'transform': 'rotateY(180deg)',

  },
  OUT:{
    fill :"red",
  }
});

class AgentList extends React.Component {

  state = {
    checked: [1] ,
    total :0 ,
    in_attendies : 0,
    out_attendies : 0 ,
    present_precent : 0
  };
componentWillReceiveProps(newProps) {
  if(newProps.data.agentusers){
    let out = newProps.data.agentusers.filter(user => user.status =="IN");
    this.setState({
      total : newProps.data.agentusers.length,
      in_attendies : out.length ,
      out_attendies : newProps.data.agentusers.length - out.length ,
      present_precent : (out.length/newProps.data.agentusers.length) * 100
    });
  }

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
  };
filterList =(event)=>{
  var updatedList = this.state.attendies_list;
  updatedList = updatedList.filter(function(item){
    return item.name.toLowerCase().search(
      event.target.value.toLowerCase()) !== -1;
  });
  this.setState({attendies_list: updatedList});
};
  render() {
    const { classes } = this.props;
    if(this.props.data.loading==true)
      return(<div className={classes.root}><CircularProgress color="accent" /></div>);
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



      return (<div className={classes.root}>
        <TextField
                placeholder="Search Agents" onChange={this.filterList}
              />
              <List>
                {this.props.data.agentusers.map(value => (
                  <AgentCard  key={value._id} data={value} dense className={classes.listItem} />

                ))}
              </List>
      </div>)
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
