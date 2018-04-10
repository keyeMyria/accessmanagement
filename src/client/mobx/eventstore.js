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
  uri: REMOTE_DOMAIN_PATH,
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
    session_empty
    session_collection{
      _id
      title
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
        title
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
    guests_number

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
    session_empty
    session_collection{
      _id
      title
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
        title
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
    guests_number
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

  @action initEventVars =()=>{
    if(this.getEventByIdExecute.data.getEventByID!=undefined){
      this.setEventSessions(this.getEventByIdExecute.data.getEventByID.session_collection)
      this.setEventWorkshops (this.getEventByIdExecute.data.getEventByID.workshops) ; 
      }
  }
    @action setEventSessions = (sessions) => {

      this.event_sessions.length=0;
      this.event_sessions = sessions;
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
    @action comparedates=(date1 , date2)=>{
      var moment_Now = moment();
      var momentStart = moment(date1);
      let momentEnd = moment(date2)
      if (moment_Now > momentStart){
        return -1;
      }
      else if (moment_Now < momentStart && moment_Now < momentEnd) return 1;
      else return 0;
    }
    @action filterEventByCurrentDate =(type)=>{
      this.unfiltered_events = this.events.filter(
        event=>{
          switch (type) {
            case "current":
            return(this.comparedates(event.start_date , event.end_date)===0)
              break;
              case  "coming":
              return(this.comparedates(event.start_date, event.end_date)==-1)
                break;
                case  "done":
                return(this.comparedates(event.start_date, event.end_date)==1)
                  break;
          }
        }
      );
    }
    @action filterWorkshopsAndSessions(status , empty) {
      this.event_sessions = this.getEventByIdExecute.data.getEventByID.session_collection.filter(
        session => {
          return session.stat===status
        }
      );
      this.event_workshops =this.getEventByIdExecute.data.getEventByID.workshops.filter(
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
          guests_number
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
          @action getFullEventDetailsByID(eventid){
            fetch({
              query: `query getEventByID($eventid:String!) {
                getEventByID(eventid : $eventid){
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
                    title
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
                      title
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
                guests_number
                  
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
          /**
          startSessionForEvent implementation
          **/
          @action startSessionForEvent(data){
            fetch({
              query :`mutation addSessionForEvent($eventid :String! , $title:String!){
                addSessionForEvent(eventid : $eventid , title:$title){
                  _id
                  start_hour
                  stat
                }
              }` ,
              variables :{
                eventid : data.eventid,
                title:data.title
              }
            }).then(res=>{
              this.getFullEventDetailsByID(data.eventid)
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
              this.getFullEventDetailsByID(eventid)
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
