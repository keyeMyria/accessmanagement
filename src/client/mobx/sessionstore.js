import { observable, action, computed, useStrict } from 'mobx';
import axios from 'axios';
import { createApolloFetch } from 'apollo-fetch';
useStrict(true);


const fetch = createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});



class SessionStore {
    // Values marked as 'observable' can be watched by 'observers'
    @observable sessions = [];
    @observable loading = true;
    @observable selectedSession = {};
    @observable sessionEntries=[];
    constructor(){
      this.getSessions()
    }
    @computed get selectedId() { return this.selectedSession.id; }
    // In strict mode, only actions can modify mobx state
    @action setSessions = (sessions) => {this.sessions = [...sessions];this.loading = false;}
    @action setSessionEntries = (entries) => {this.sessionEntries = [...entries];}

    @action selectSession = (session) => { this.selectedSession = session; }
    // Managing how we clear our observable state
    @action clearSelectedSession = () => { this.selectedSession = {}; }
    @action getSessions = async () => {
      const data = await fetch({
              query: `query getActiveSessions {
                getActiveSessions {
                _id
                start_hour
                end_hour
                workshop{
                  _id
                  name
                }
                agents {
                  _id
                  username
                  role{
                    name
                  }
                }
                }
              }`
            })
            this.setSessions(data.data.getActiveSessions);
            return data;

}
    @action getUnaffectedAgents =async ()=>{
      const agents = await fetch({
        query:`query getUnaffectedAgents{
          getUnaffectedAgents{
            _id
            username
            role{
              name
            }
          }
        }`
      });
      return agents;
    }
    @action getEntriesBySessionId=(sessionId)=>{
      fetch({
        query:`
          query activitylistbysessionID($sessionId:ID){
            activitylistbysessionID(sessionId:$sessionId){
              entryId
              dateEntry
              action
              agent{
                username
              }
              user{
                _id
                profile{
                  name
                  forname
                  avatar
                }
              }
            }
          }
        `,
        variables:{
          sessionId : sessionId
        }
      }).then(res=>{
        this.setSessionEntries(res.data.activitylistbysessionID)
      })
    }
    @action getGuestStatusBySession =(sessionId)=>{
      fetch({
        query:`query getGuestStatusBySession($sessionId:ID!){
          getGuestStatusBySession(sessionId:$sessionId){
            _id

            status
            profile{
              name
              forname
              avatar
            }
          }
        }` ,
        variables :{
          sessionId : sessionId
        }
      }).then(res=>{
        console.log(res)
      })
    }
}

const store = new SessionStore();
export default store;
