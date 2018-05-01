import React from 'react';
import DashboardUnit from './DashboardUnit';
import WorkshopUnit from './WorkshopUnit';

import {observable} from 'mobx'
import {observer , inject} from 'mobx-react';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';

import EventStore from '../../mobx/eventstore';
@observer
class EventDashboard extends React.Component{
  constructor(props){
    super(props);
    this.state={
      on_filter :false ,
      off_filter : false,
      initiated : false
    }
    EventStore.setEventId(props.match.params.id);
    EventStore.getFullEventDetailsByID(props.match.params.id)  ;
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
		event = EventStore.selectedEvent;
     if (event == undefined) {
			return (
				<div>
					<CircularProgress color="primary" />
				</div>
			);
    }
    else {

      return(
        <div>
          <div className="Btns-filter">
                <Button  className={this.state.on_filter ? "filter-activ" :"filterLink" } onClick={()=>this.filterWorkshopsAndSessions("ON" , false)}>
                  الحالي
                </Button>
                <Button className={this.state.off_filter ? "filter-activ" :"filterLink" } onClick={()=>this.filterWorkshopsAndSessions("OFF" , true)}>
                  الفارط
                </Button>
        </div>
          {(EventStore.event_sessions!== undefined)&&
            EventStore.event_sessions.map(gen_session=>{
              return(<DashboardUnit key={gen_session._id} details={gen_session} size={event.guests_number} />);
            })}
          {(EventStore.event_workshops!== undefined)&& EventStore.event_workshops.map(work=>{
                 return(<WorkshopUnit key={work._id} details={work} users={work.guests_number}/>);
            })
          }

      </div>)
    }

  }
}
export default EventDashboard;
