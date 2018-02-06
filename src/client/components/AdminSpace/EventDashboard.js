import React from 'react';
import DashboardUnit from './DashboardUnit';
import {observer} from 'mobx-react';
import EventStore from '../../mobx/eventstore';
import Button from 'material-ui/Button';

@observer
class EventDashboard extends React.Component{
  constructor(props){
    super(props);
    EventStore.getFullEventDetailsByID(props.match.params.id)
  }
  render(){
    return(
      <div>
        <Button color="accent">
          Current
        </Button>
        <Button  color="accent">
          Closed
        </Button>
        {(EventStore.selectedEvent.session_collection!== undefined)&&
          EventStore.selectedEvent.session_collection.map(gen_session=>{
            return(<DashboardUnit key={gen_session._id} details={gen_session}/>);
          })}
        {(EventStore.selectedEvent.workshops!== undefined)&& EventStore.selectedEvent.workshops.map(work=>{
            //work.session_list.map(session=>{
              return(<DashboardUnit key={work._id} details={work}/>);
            //})
          })
        }

    </div>)
  }
}
export default EventDashboard;
