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
import { Motion , spring} from 'react-motion';
import { observer } from 'mobx-react';
import SessionStore from '../../mobx/sessionstore';
import './vendor/agents.css'
import _ from 'lodash'
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
const dataStructure = [ // structure that models our initial rendered view of items
]

const reinsert = (array, colFrom, rowFrom, colTo, rowTo) => {
    const _array = array.slice(0);
    const val = _array[colFrom][rowFrom];
    _array[colFrom].splice(rowFrom, 1);
    _array[colTo].splice(rowTo, 0, val);
    calculateVisiblePositions(_array);
    return _array;
}

const gutterPadding = 21;
const clamp = (n, min, max) => Math.max(Math.min(n, max), min);
const getColumnWidth = () => (window.innerWidth / dataStructure.length) - (gutterPadding / dataStructure.length); // spread columns over available window width
const height = 110; // crappy fixed item height :(

let width = getColumnWidth(),
    layout = null;

// items are ordered by their index in this visual positions array
const calculateVisiblePositions = (newOrder) => {
    width = getColumnWidth();
    layout = newOrder.map((column, col) => {
       return _.range(column.length + 1).map((item, row) => {
           return [width * col, height * row];
       });
   });
}

// define spring motion opts
const springSetting1 = {stiffness: 180, damping: 10};
const springSetting2 = {stiffness: 150, damping: 16};

@observer
class DraggableList extends React.Component{
  constructor(props){
    super(props)
    SessionStore.getSessions();
    dataStructure.push(props.users);


    this.state ={
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and item position, for dragging
      lastPress: null, // key of the last pressed component
      currentColumn: null,
      isPressed: false,
      order: dataStructure, // index: visual position. value: component key/id
      isResizing: false
    }
  }

    componentWillMount=()=>{
        this.resizeTimeout = null;
        calculateVisiblePositions(dataStructure);
    }

    componentDidMount=()=>{
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('touchend', this.handleMouseUp);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount=()=>{
        window.removeEventListener('resize', this.handleResize);
    }

    handleTouchStart=(key, currentColumn, pressLocation, e)=>{
        this.handleMouseDown(key, currentColumn, pressLocation, e.touches[0]);
    }

    handleTouchMove=(e)=>{
        e.preventDefault();
        this.handleMouseMove(e.touches[0]);
    }

    handleMouseMove=({pageX, pageY})=>{
        const {order, lastPress, currentColumn: colFrom, isPressed, delta: [dx, dy]} = this.state;
        if (isPressed) {
            const mouse = [pageX - dx, pageY - dy];
            const colTo = clamp(Math.floor((mouse[0] + (width / 2)) / width), 0, 2);
            const rowTo = clamp(Math.floor((mouse[1] + (height / 2)) / height), 0, 100);
            const rowFrom = order[colFrom].indexOf(lastPress);
            const newOrder = reinsert(order, colFrom, rowFrom, colTo, rowTo);
            this.setState({
                mouse,
                order: newOrder,
                currentColumn: colTo
            });
        }
    }

    handleMouseDown=(key, currentColumn, [pressX, pressY], {pageX, pageY})=>{
        this.setState({
            lastPress: key,
            currentColumn,
            isPressed: true,
            delta: [pageX - pressX, pageY - pressY],
            mouse: [pressX, pressY],
        });
    }

    handleMouseUp=()=>{
        this.setState({
            isPressed: false,
            delta: [0, 0]
        });
    }

    handleResize=()=>{
        clearTimeout(this.resizeTimeout);
        this.applyResizingState(true);
        // resize one last time after resizing stops, as sometimes this can be a little janky sometimes...
        this.resizeTimeout = setTimeout(() => this.applyResizingState(false), 100);
    }

    applyResizingState=(isResizing)=>{
        this.setState({ isResizing });
        calculateVisiblePositions(dataStructure);
    }

    render() {
        const { order, lastPress, currentColumn, isPressed, mouse, isResizing } = this.state;
        SessionStore.sessions.map((element)=>{
          console.log(element)
          dataStructure.push(element)
        });
        return (
            <div className="items">
                {dataStructure.map( (column, colIndex) => {
                    return (
                        column.map( (row) => {
                            let style,
                                x,
                                y,
                                visualPosition = order[colIndex].indexOf(row),
                                isActive = (row === lastPress && colIndex === currentColumn && isPressed);

                            if(isActive) {
                                [x, y] = mouse;
                                style = {
                                    translateX: x,
                                    translateY: y,
                                    scale: spring(1.1, springSetting1)
                                };
                            } else if(isResizing) {
                                [x, y] = layout[colIndex][visualPosition];
                                style = {
                                    translateX: x,
                                    translateY: y,
                                    scale: 1
                                };
                            } else {
                                [x, y] = layout[colIndex][visualPosition];
                                style = {
                                    translateX: spring(x, springSetting2),
                                    translateY: spring(y, springSetting2),
                                    scale: spring(1, springSetting1)
                                };
                            }

                            return (
                                <Motion key={row._id} style={style}>
                                    {({translateX, translateY, scale}) =>
                                    <div
                                        onMouseDown={this.handleMouseDown.bind(null, row, colIndex, [x, y])}
                                        onTouchStart={this.handleTouchStart.bind(null, row, colIndex, [x, y])}
                                        //className={isActive ? 'item is-active' : 'item'}
                                        style={{
                                            WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                                            transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                                            zIndex: (row === lastPress && colIndex === currentColumn) ? 99 : visualPosition,
                                        }}>
                                        <AgentCard data={row} dense />

                                      </div>
                                    }
                                </Motion>
                            )
                        })
                    )
                })}
            </div>
        )
    }
};

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
              <DraggableList users ={this.props.data.agentusers}/>
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
