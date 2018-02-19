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
    this.state={
      on_filter :false ,
      off_filter : false
    }

  };
  filterWorkshopsAndSessions =(stat , empty)=>{
    EventStore.filterWorkshopsAndSessions(stat , empty);
    if(stat=="ON")
    this.setState({
      on_filter : true ,
      off_filter : false
    })
    else
    this.setState({
      on_filter : false ,
      off_filter : true
    })
  }
  render(){
    return(
      <div>
        <div className="Btns-filter">
              <Button  className={this.state.on_filter ? "filter-activ" :"secondary" } onClick={()=>this.filterWorkshopsAndSessions("ON" , false)}>
                الحالي
              </Button>
              <Button className={this.state.off_filter ? "filter-activ" :"secondary" } onClick={()=>this.filterWorkshopsAndSessions("OFF" , true)}>
                الفارط
              </Button>
      </div>
        {(EventStore.event_sessions!== undefined)&&
          EventStore.event_sessions.map(gen_session=>{
            return(<DashboardUnit key={gen_session._id} details={gen_session} users={gen_session.users}/>);
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
