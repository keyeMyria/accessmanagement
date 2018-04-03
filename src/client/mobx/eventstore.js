import { observable, action, computed, useStrict , extendObservable} from 'mobx';
import { createApolloFetch } from 'apollo-fetch';
import moment from 'moment';
import gql from 'graphql-tag';
import graphql from 'mobx-apollo';
import { getOperationAST } from 'graphql';

import { WebSocketLink } from 'apollo-link-ws';
import DOMAIN_PATH ,{REMOTE_DOMAIN_PATH , LOCAL_WEBSOCKET_ENDPOINT} from '../app/config'

import { ApolloLink, concat } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


useStrict(true);
const fetch = createApolloFetch({
  uri: DOMAIN_PATH,
});

const link = ApolloLink.split(
  operation => {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink({
    uri: LOCAL_WEBSOCKET_ENDPOINT,
    options: {
      reconnect: true, //auto-reconnect
      // // carry login state (should use secure websockets (wss) when using this)
      // connectionParams: {
      //   authToken: localStorage.getItem("Meteor.loginToken")
      // }
    }
  }),
  new HttpLink({ uri: REMOTE_DOMAIN_PATH })
);

const cache = new InMemoryCache(window.__APOLLO_STATE);
 const client = new ApolloClient({
  link:  link ,
  cache:cache

});
const  getEventById = gql`query getEventByID($eventid:String!) {
  getEventByID(eventid:$eventid){
    _id
    title
    type
    place   
    start_date
    end_date
    numberAttendies
    session_empty
    session_collection{
      _id
      start_hour
      end_hour
      stat
      closed_in
      closed_out
      closed_abscent

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
        closed_in
        closed_out
        closed_abscent
      }
      users{
        _id
        status
      }

    }

  }
}`

const getFullEventById=gql`query getEventByID($eventid:String!) {
  getEventByID(eventid:$eventid){
    _id
    title
    type
    place   
    start_date
    end_date
    numberAttendies
    session_empty
    session_collection{
      _id
      start_hour
      end_hour
      stat
      closed_in
      closed_out
      closed_abscent

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
        closed_in
        closed_out
        closed_abscent
      }
      users{
        _id
        status
      }

    }

  }
}`

class EventStore {
  constructor(){
    extendObservable(this , {
      get getEventByIdExecute(){
        return graphql({ client, query: getEventById , variables:{eventid:this.eventid}});            
      }
   
  })
  }


    // Values marked as 'observable' can be watched by 'observers'
    @observable unfiltered_events = [];
    @observable eventid = "default";
    @observable events =[];
    @observable loading = true;
    @observable selectedEvent = {};
    @observable event_sessions =[];
    @observable event_workshops=[];
    // In strict mode, only actions can modify mobx state
    @action setEventId = (eventid)=>{
      this.eventid = eventid
    }
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
      this.event_sessions.length=0;
      sessions.map(session=>{
        this.getNumberOfGuestsPerSession(session._id , session)
        let users = this.getUserDataForChartOfSession(session._id);
        users.then(res=>{
          session.users = res.data.getUserDataForChartOfSession;
          this.addSessionToEventSessions(session);
        })

      })
    }
    @action getNumberOfGuestsPerSession =(sessionId ,session)=>{
      fetch({
        query :`query getNumberOfGuestsPerSession($sessionId:String!){
          getNumberOfGuestsPerSession(sessionId:$sessionId)
        }`,
        variables:{
          sessionId:sessionId
        }
      }).then(res=>{
        session.expected_guests=res.data.getNumberOfGuestsPerSession
      })
    }
    @action setEventWorkshops = (workshops) => {
      this.event_workshops.length=0;
      this.event_workshops = [...workshops]; }

    @action selectEvent = (event) => {this.selectedEvent = event;  }
    // Managing how we clear our observable state
    @action clearSelectedEvent = () => { this.selectedEvent = {}; }
    // An example that's a little more complex
    @action addnewEventToList = (event) => { this.events.push(event); }
    @action addWorkShopToCurrentEvent = (workshop)=>{
      this.selectedEvent.workshops.push(workshop)
    }
    @action comparedates=(date2)=>{
      var momentA = moment();
      var momentB = moment(date2);
      if (momentA > momentB){
        return -1;
      }
      else if (momentA < momentB) return 1;
      else return 0;
    }
    @action filterEventByCurrentDate =(type)=>{
      this.unfiltered_events = this.events.filter(
        event=>{
          switch (type) {
            case "current":
            return(this.comparedates(event.start_date)===0)
              break;
              case  "coming":
              return(this.comparedates(event.start_date)==1)
                break;
                case  "done":
                return(this.comparedates(event.start_date)==-1)
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
          place
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
      @action initSelectedEventStateOFSession =(state)=>{
        this.selectedEvent.session_empty = state;
      }
      @action UpdateEvent=(data)=>{
        fetch({
          query: `mutation UpdateEvent($title :String!, $type:String!, $place:String!, $end_date:String! , $start_date:String! , $id:ID!) {
            UpdateEvent(title:$title , type:$type , place:$place , end_date:$end_date , start_date:$start_date , _id:$id)  {
              _id
              title
              type
              place
              start_date
              end_date
              numberAttendies
            }
          }`,
          variables:{
            title : data.title ,
            type : data.type ,
            place: data.place,
            end_date : data.end_date ,
            start_date : data.start_date ,
            id : data._id ,
          }
        }).then(res => {
          this.getEvents()
        });
      }
      @action addNewEvent=(data)=>{
        fetch({
          query: `mutation addNewEvent($title :String!, $type:String!, $place:String!, $end_date:String! , $start_date:String! , $file:String!) {
            addNewEvent(title:$title , type:$type , place:$place , end_date:$end_date , start_date:$start_date , file:$file)  {
              _id
              title
              type
              place
              start_date
              end_date
              numberAttendies
            }
          }`,
          variables:{
            title : data.title ,
            type : data.type ,
            place: data.place,
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
              this.initSelectedEventStateOFSession(false);              
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
              this.initSelectedEventStateOFSession(true);              
              this.getEvents();
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
