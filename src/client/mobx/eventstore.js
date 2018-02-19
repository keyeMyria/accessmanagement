import { observable, action, computed, useStrict } from 'mobx';
import { createApolloFetch } from 'apollo-fetch';
import moment from 'moment';

useStrict(true);


const fetch = createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});



class EventStore {
    // Values marked as 'observable' can be watched by 'observers'
    @observable unfiltered_events = [];
    @observable events =[];
    @observable selectedEvent = {};
    @observable event_sessions =[];
    @observable event_workshops=[];
    // In strict mode, only actions can modify mobx state
    @action setEvents = (events) => {
      this.events.length=0;
      this.events = [...events];
    }
    @action setUnfilteredEvents=(events) =>{
      this.unfiltered_events.length=0;
      this.unfiltered_events =[...events]
    }
    @action addSessionToEventSessions =(session)=>{
      this.event_sessions.push(session)
    }
    @action setEventSessions = (sessions) => {
      //this.event_sessions.length=0;
      // sessions.map(session=>{
      //
      //   let users = this.getUserDataForChartOfSession(session._id);
      //   users.then(res=>{
      //     session.users = res.data.getUserDataForChartOfSession;
      //     this.addSessionToEventSessions(session);
      //   })
      //
      // })
    }
    @action setEventWorkshops = (workshops) => {
      this.event_workshops.length=0;
      this.event_workshops = [...workshops]; }

    @action selectEvent = (event) => {this.selectedEvent = event; }
    // Managing how we clear our observable state
    @action clearSelectedEvent = () => { this.selectedEvent = {}; }
    // An example that's a little more complex
    @action addnewEventToList = (event) => { this.events.push(event); }
    @action addWorkShopToCurrentEvent = (workshop)=>{
      this.selectedEvent.workshops.push(workshop)
    }
    @action comparedates=(date1 , date2)=>{
      var momentA = moment(date1,"DD/MM/YYYY");
      var momentB = moment(date2,"DD/MM/YYYY");
      if (momentA > momentB) return 1;
      else if (momentA < momentB) return -1;
      else return 0;
    }
    @action filterEventByCurrentDate =(type)=>{
      this.unfiltered_events = this.events.filter(
        event=>{
          switch (type) {
            case "current":
            return(this.comparedates(moment() , event.start_date)===0)
              break;
              case  "coming":
              return(this.comparedates(moment() , event.start_date)==1)
                break;
                case  "done":
                return(this.comparedates(moment() , event.start_date)==-1)
                  break;
          }
        }
      );
    }
    @action filterWorkshopsAndSessions(status , empty) {
      this.event_sessions = this.selectedEvent.session_collection.filter(
        session => {
            let users = this.getUserDataForChartOfSession(session._id);
            users.then(res=>{
              session.users = res.data.getUserDataForChartOfSession;
            })
          return session.stat===status
        }
      );
      this.event_workshops =this.selectedEvent.workshops.filter(
        work=>{
          work.session_empty==empty
        }
      );
    }
    @observable filtered_workshops = [];
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
          session_collection{
            _id
            start_hour
            end_hour
            stat
          }
          workshops{
            _id
            name
            session_empty
            session_list{
              start_hour
              end_hour
              stat
            }
          }

        }
      }`,
    }).then(res => {
      this.setEvents(res.data.eventlist);
      this.setUnfilteredEvents(res.data.eventlist)
    });
      }
      @action addNewEvent(data){
        console.log(data)
        fetch({
          query: `mutation addNewEvent($title :String!, $type:String! , $end_date:String! , $start_date:String! , $file:String!) {
            addNewEvent(title:$title , type:$type , end_date:$end_date , start_date:$start_date , file:$file)  {
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
            file : data.file
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
                  session_collection{
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
          @action getFullEventDetailsByID(eventid){
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
                  session_collection{
                    _id
                    start_hour
                    end_hour
                    stat
                    expected_guests{
                      _id
                      username

                    }
                  }
                  workshops{
                    _id
                    name
                    session_empty
                    session_list {
                      _id
                      start_hour
                      end_hour
                      stat
                    }
                    users{
                      _id
                      status
                    }

                  }

                }
              }`,
              variables :{
                eventid :eventid
              }
            }).then(res=>{
              this.selectEvent(res.data.getEventByID);
              this.setEventSessions(res.data.getEventByID.session_collection);
              this.setEventWorkshops(res.data.getEventByID.workshops);
            })
          }
          @action getUserDataForChartOfSession = async (sessionId)=>{
            const users = await fetch({
              query:`query getUserDataForChartOfSession($sessionId:ID!){
              getUserDataForChartOfSession(sessionId:$sessionId){
                _id
                username
                status
                profile{
                  name
                  forname
                  avatar
                  tel

                }
              }
            }` ,
            variables :{
              sessionId : sessionId
            }
          })
            return users;
        }
      }
const storeevent = new EventStore();

export default storeevent;
