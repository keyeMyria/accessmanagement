import React from 'react';
import DashboardUnit from './DashboardUnit';
import WorkshopUnit from './WorkshopUnit';

import {observable} from 'mobx'
import {observer} from 'mobx-react';
import EventStore from '../../mobx/eventstore';
import Button from 'material-ui/Button';

@observer
class EventDashboard extends React.Component{
  constructor(props){
    super(props);
    EventStore.getFullEventDetailsByID(props.match.params.id)

  };
  filterWorkshopsAndSessions =(stat , empty)=>{
    EventStore.filterWorkshopsAndSessions(stat , empty);
  }
  render(){
    return(
      <div>
        <div className="Btns-filter">
              <Button  className="filter-activ" onClick={()=>this.filterWorkshopsAndSessions("ON" , false)}>
                الحالي
              </Button>
              <Button color="secondary" onClick={()=>this.filterWorkshopsAndSessions("OFF" , true)}>
                الفارط
              </Button>
      </div>
        {(EventStore.event_sessions!== undefined)&&
          EventStore.event_sessions.map(gen_session=>{
            return(<DashboardUnit key={gen_session._id} details={gen_session} users={gen_session.expected_guests}/>);
          })}
        {(EventStore.event_workshops!== undefined)&& EventStore.event_workshops.map(work=>{
            //work.session_list.map(session=>{
              return(<WorkshopUnit key={work._id} details={work} users={work.users}/>);
            //})
          })
        }

    </div>)
  }
}
export default EventDashboard;
