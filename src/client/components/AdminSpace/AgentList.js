import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AgentCard from './AgentCard';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { observer } from 'mobx-react';
import SessionStore from '../../mobx/sessionstore';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  marginBottom: grid,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});



class AgentList extends React.Component {
constructor(props){
  super(props)

  this.state = {
        items: getItems(10)
    };

}
onDragEnd=(result)=>{
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }
  // componentWillReceiveProps=(newProps)=>{
  //   if(newProps.data.agentusers){
  //     let out = newProps.data.agentusers.filter(user => user.status =="IN");
  //     let unaffected = [];
  //     newProps.data.agentusers.map(item=>{
  //       unaffected.push(item);
  //     })
  //     //dataStructure.push({'name':'present' , 'items' : unaffected})
  //     const sessions =SessionStore.getSessions();
  //     sessions.then(res=>{
  //       let arr = res.data.getActiveSessions;
  //       arr.map(item=>{
  //         // dataStructure.push({
  //         //   name : item.workshop!=null ? item.workshop.name : 'session generale',
  //         //   items :[]
  //         // })
  //
  //       })
  //
  //     })
  //
  //   }
  //
  // }


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
      if(this.props.data.loading==true)
        return(<div><CircularProgress color="accent" /></div>);
        else if (this.props.data.agentusers==null || Object.keys(this.props.data.agentusers).length === 0) {
            return (
                <div>
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
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {this.state.items.map(item => (
                        <Draggable key={item.id} draggableId={item.id}>
                          {(provided, snapshot) => (
                            <div>
                              <div
                                ref={provided.innerRef}
                                style={getItemStyle(
                                  provided.draggableStyle,
                                  snapshot.isDragging
                                )}
                                {...provided.dragHandleProps}
                              >
                                {item.content}
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
        )


    }
  }
}

AgentList.propTypes = {
  //classes: PropTypes.object.isRequired,
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
export default AgentsWithData;
