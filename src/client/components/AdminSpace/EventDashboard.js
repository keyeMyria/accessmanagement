import React from 'react';
import DashboardUnit from './DashboardUnit';
import {observer} from 'mobx-react';
import EventStore from '../../mobx/eventstore';
import Button from 'material-ui/Button';

@observer
class EventDashboard extends React.Component{
  constructor(props){
    super(props);
    EventStore.getFullEventDetailsByID('5a5c9013968f5b0d1baf68d2')
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
        {(EventStore.selectedEvent.sessions!== undefined)&&
          EventStore.selectedEvent.sessions.map(gen_session=>{
            console.log(gen_session)
            return(<DashboardUnit key={gen_session._id} details={gen_session}/>);
          })}
        {(EventStore.selectedEvent.workshops!== undefined)&& EventStore.selectedEvent.workshops.map(work=>{
          console.log(work)
            work.sessions.map(session=>{
              return(<DashboardUnit key={work._id} details={session}/>);
            })
          })
        }

    </div>)
  }
}
export default EventDashboard;
