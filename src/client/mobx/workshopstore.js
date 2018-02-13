import { observable, action, computed, useStrict } from 'mobx';
import axios from 'axios';
import { createApolloFetch } from 'apollo-fetch';
import EventStore from './eventstore';
useStrict(true);


const fetch = createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});



class WorkshopStore {
    // Values marked as 'observable' can be watched by 'observers'
    @observable state = 'loading' ;
    @observable workshops = [];
    @observable users = [];
    @observable selectedWorkshop = {};
    @observable selectedEvent = {};
    @computed get selectedId() { return this.selectedWorkshop._id; }
    @action setStateAction = (state) => {this.state=state }
    @observable agent_session ={};
    // In strict mode, only actions can modify mobx state
    @action setWorkshops = (workshops) => {
      this.workshops.length=0;
      this.workshops = [...workshops]; }
    @action selectWorkshop = (workshop) => {this.selectedWorkshop = workshop;}
    @action setSelectedWorkShopEvent = (event) =>{this.selectedEvent=event}
    @action getEvent = ()=>{
      return this.selectedEvent;
    }
    @action setSession = (session) => {this.agent_session = session; }
    @action setUsers=(users)=>{
      this.users = users;
    }
    // Managing how we clear our observable state
    @action clearSelectedWorkshop = () => { this.selectedWorkshop = {}; }
    @action addnewWorkshopToList =(work) =>{this.workshops.push(work);}

    // An example that's a little more complex
    @action getWorkshopsForEvent(eventid) {
  	//Managing Async tasks like ajax calls with Mobx actions
    fetch({
      query: `query workshoplist($eventid :String!) {
        getWorkshopsListForEvent(eventid : $eventid) {
          _id
          name
          session_empty
          session_list {
            _id
            start_hour
            end_hour
            stat
          }
        }
      }`,
        variables:{
          eventid : eventid
        },
    }).then(res => {
      this.setWorkshops(res.data.getWorkshopsListForEvent);
      this.setStateAction('loaded')
    });
      }
      @action addNewSessionForWorkShop(workshopid){
        fetch({
          query: `mutation addSessionForWorkshop($workshopid :String!) {
            addSessionForWorkshop( workshopid : $workshopid)  {
              _id
              start_hour
              end_hour
              stat
            }
          }`,
          variables:{
            workshopid : workshopid
          }
        }).then(res => {
          this.getWorkshopsForEvent(this.getEvent())

        });
      }
      @action addNewWorkshop(data){
        fetch({
          query: `mutation addWorkShopForEvent($name :String! , $event_id :String! , $users :[ID!]) {
            addWorkShopForEvent(name:$name , event_id : $event_id , users:$users)  {
              _id
              name
              session_empty
            }
          }`,
          variables:{
            name : data.name ,
            users :data.users,
            event_id : this.getEvent()
          }
        }).then(res => {
          this.getWorkshopsForEvent(this.getEvent())
          //this.addnewWorkshopToList(res.data) ;
        });
      }
      @action stopSessionForWorkShop(workshopid){
        fetch({
          query: `mutation closeSessionForWorkshop( $workshopid :String!) {
            closeSessionForWorkshop(workshopid:$workshopid)  {
              start_hour
              end_hour
              stat
            }
          }`,
          variables:{
            workshopid : workshopid
          }
        }).then(res => {
          this.getWorkshopsForEvent(this.getEvent())

        });
      }
      @action fetchWorkshopDataForAgent = (userid)=>{
         fetch({
          query : `query getWorkshopByUserId($id : ID!){
            getWorkshopByUserId(id :$id){
              _id
              username
              session{
                _id
                start_hour
                end_hour
              }
              workshop{
                _id
                name
                users{
                  _id
                  status
                }
              }
            }

          }`,
          variables :{
            id : userid
          }
        }).then(res=>{

               if(res.data.getWorkshopByUserId!== null && res.data.getWorkshopByUserId.workshop!=null){
                  this.selectWorkshop(res.data.getWorkshopByUserId);
                  this.setUsers(res.data.getWorkshopByUserId.workshop.users)

               }
               if(res.data.getWorkshopByUserId.session!=null){
                 this.setSession(res.data.getWorkshopByUserId.session);
                 let users = EventStore.getUserDataForChartOfSession(res.data.getWorkshopByUserId.session._id);
                 users.then(res=>{
                   this.setUsers(res.data.getUserDataForChartOfSession)
                 })
               }

        })
      }
}

const store = new WorkshopStore();

export default store;
export { WorkshopStore };
