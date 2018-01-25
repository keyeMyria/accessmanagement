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
    @observable selectedWorkshop = {};
    @observable selectedEvent = {};
    @computed get selectedId() { return this.selectedWorkshop._id; }
    @action setStateAction = (state) => {this.state=state }

    // In strict mode, only actions can modify mobx state
    @action setWorkshops = (workshops) => {this.workshops = [...workshops]; }
    @action selectWorkshop = (workshop) => { this.selectedWorkshop = workshop; }
    @action setSelectedWorkShopEvent = (event) =>{this.selectedEvent=event}
    @action getEvent = ()=>{
      return this.selectedEvent;
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
          sessions {
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
          query: `mutation addWorkShopForEvent($name :String! , $event_id :String!) {
            addWorkShopForEvent(name:$name , event_id : $event_id)  {
              _id
              name
              session_empty
            }
          }`,
          variables:{
            name : data.name ,
            event_id : this.getEvent()
          }
        }).then(res => {
          console.log(this.getEvent())
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
      @action fetchWorkshopDataForAgent = async(userid)=>{
        const workshop = await fetch({
          query : `query getWorkshopByUserId($id : ID!){
            getWorkshopByUserId(id :$id){
              name
              users{
                _id
              }
              sessions{
                start_hour
                entries{
                  _id
                }
              }
            }

          }`,
          variables :{
            id : userid
          }
        })
      }
}

const store = new WorkshopStore();

export default store;
export { WorkshopStore };
