import { observable, action, computed, useStrict } from 'mobx';
import { createApolloFetch } from 'apollo-fetch';
useStrict(true);


const fetch = createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});



class EventStore {
    // Values marked as 'observable' can be watched by 'observers'
    @observable events = [];
    @observable selectedEvent = {};
    // In strict mode, only actions can modify mobx state
    @action setEvents = (events) => {this.events = [...events]; }
    @action selectEvent = (event) => {this.selectedEvent = event;}
    // Managing how we clear our observable state
    @action clearSelectedEvent = () => { this.selectedEvent = {}; }
    // An example that's a little more complex
    @action addnewEventToList = (event) => { this.events.push(event); }
    @action addWorkShopToCurrentEvent = (workshop)=>{
      this.selectedEvent.workshops.push(workshop)
    }
    @action getEvents() {
  	//Managing Async tasks like ajax calls with Mobx actions
    fetch({
      query: `query eventlist {
        eventlist {
          _id
          title
          type
          start_date
          end_date
          numberAttendies
          session_empty
          sessions{
            _id
            start_hour
            end_hour
            stat
          }
          workshops{
            _id
            name
            session_empty
            sessions{
              start_hour
              end_hour
            }
          }

        }
      }`,
    }).then(res => {
      this.setEvents(res.data.eventlist);
    });
      }
      @action addNewEvent(data){
        fetch({
          query: `mutation addNewEvent($title :String!, $type:String! , $end_date:String! , $start_date:String! , $numberAttendies:Int!) {
            addNewEvent(title:$title , type:$type , end_date:$end_date , start_date:$start_date , numberAttendies:$numberAttendies)  {
              _id
              title
              type
              start_date
              end_date
              numberAttendies
            }
          }`,
          variables:{
            title : data.title ,
            type : data.type ,
            end_date : data.end_date ,
            start_date : data.start_date ,
            numberAttendies : data.numberAttendies
          }
        }).then(res => {
          this.getEvents()
        });
          }
          /**
          startSessionForEvent implementation
          **/
          @action startSessionForEvent(eventid){
            fetch({
              query :`mutation addSessionForEvent($eventid :String!){
                addSessionForEvent(eventid : $eventid){
                  _id
                  start_hour
                  stat
                }
              }` ,
              variables :{
                eventid : eventid
              }
            }).then(res=>{
              this.getEventByID(eventid)
            })
          }
          @action stopSessionForEvent(sessionid , eventid){
            fetch({
              query :`mutation closeSessionForEvent($sessionid:String! , $eventid:String!){
                closeSessionForEvent(sessionid : $sessionid , eventid : $eventid){
                  _id
                  start_hour
                  stat
                }
              }` ,
              variables :{
                sessionid : sessionid,
                eventid : eventid
              }
            }).then(res=>{
              this.getEventByID(eventid)
            })
          }
          @action deleteEvent(eventid){
            fetch({
              query :`mutation removeEvent($eventid:String!){
                removeEvent(eventid : $eventid){
                  _id
                }
              }` ,
              variables :{
                eventid : eventid
              }
            }).then(res=>{
              this.getEvents();
            })
          }
          @action getEventByID(eventid){
            fetch({
              query: `query getEventByID($eventid:String!) {
                getEventByID(eventid : $eventid){
                  _id
                  title
                  type
                  start_date
                  end_date
                  numberAttendies
                  session_empty
                  sessions{
                    _id
                    start_hour
                    end_hour
                    stat
                  }
                  workshops{
                    _id
                    name
                    session_empty
                  }

                }
              }`,
              variables :{
                eventid :eventid
              }
            }).then(res=>{
              this.selectEvent(res.data.getEventByID)
            })
          }
      }


const storeevent = new EventStore();

export default storeevent;
