import { observable, action, computed, useStrict, extendObservable } from 'mobx';
import axios from 'axios';
import { createApolloFetch } from 'apollo-fetch';
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
    }
  }),
  new HttpLink({ uri: REMOTE_DOMAIN_PATH })
);

const cache = new InMemoryCache(window.__APOLLO_STATE);
 const client = new ApolloClient({
  link:  link ,
  cache:cache

});

const getSessionStats= gql`query getSessionStats($sessionId:String! , $status:String!) {
    getSessionStats(sessionId:$sessionId , status:$status)
  }`

const sessionSubscription=gql`
  subscription {
    refreshedSessionStats{
      in 
      out 
      abscent
    }
  }
`
class SessionStore {
  constructor(){
    extendObservable(this , {
      get getSessionStatsIn(){
        return this.sessions[this.sessionid]["in"]=(
         graphql({ client, query: getSessionStats , variables:{sessionId:this.sessionid , status:"IN"}})                   
        )
      },
      get getSessionStatsOut(){
        return this.sessions[this.sessionid]["out"]=graphql({ client, query: getSessionStats , variables:{sessionId:this.sessionid , status:"OUT"}})            
      },
      get getSessionStatsAbscent(){
        return this.sessions[this.sessionid]["abscent"]=graphql({ client, query: getSessionStats , variables:{sessionId:this.sessionid , status:"ABSCENT"}})         
      },
      get getSessionStatsIntruders(){
        return this.sessions[this.sessionid]["intruders"]=graphql({ client, query: getSessionStats , variables:{sessionId:this.sessionid , status:"INTRU"}})         
      }
    })
    
  }
  subscribe=(sessionid)=>{
    this.getSessionStatsIn.ref.subscribeToMore({
       document : sessionSubscription,
       updateQuery:(current , {subscriptionData})=>{ 
         this.updateSessionStatsValue(sessionid , "in" ,subscriptionData.data.refreshedSessionStats.in)

       }
     });
     this.getSessionStatsOut.ref.subscribeToMore({
      document : sessionSubscription,
      updateQuery:(current , {subscriptionData})=>{      
        this.updateSessionStatsValue(sessionid , "out"  , subscriptionData.data.refreshedSessionStats.out)
      }
    });
    this.getSessionStatsAbscent.ref.subscribeToMore({
      document : sessionSubscription,
      updateQuery:(current , {subscriptionData})=>{
        this.updateSessionStatsValue(sessionid , "abscent" , subscriptionData.data.refreshedSessionStats.abscent)
      }
    });
    this.getSessionStatsIntruders.ref.subscribeToMore({
      document:sessionSubscription ,
      updateQuery : (current , {subscriptionData})=>{
        this.updateSessionStatsValue(sessionid , "intruders" , subscriptionData.data.refreshedSessionStats.intruders)
        
      }
    })
   }
   @action updateSessionStatsValue=(sessionid , ref , value)=>{
     console.log(this.sessions[sessionid])
     this.sessions[sessionid][ref].data.getSessionStats = value;
   }
    // Values marked as 'observable' can be watched by 'observers'
    @observable sessions = [];
    @observable loading = true;
    @observable sessionid = null;    
    @observable sessionusers =[];
    @observable selectedSession = {};
    @observable sessionEntries=[];
    @computed get selectedId() { return this.selectedSession.id; }
    @action setSessionId=(sessionid)=>{
      this.sessionid = sessionid;
      this.sessions[this.sessionid]=[]
    }
    // In strict mode, only actions can modify mobx state
    @action setSessions = (sessions) => {
      this.sessions.length=0;
      this.sessions = [...sessions];
      this.loading = false;}
    @action setSessionEntries = (entries) => {
      this.sessionEntries.length=0;
      this.sessionEntries = [...entries];
    }
    @action setsessionusers =(users) =>{
      this.sessionusers.length=0;
      this.sessionusers = [...users]
    }
    @action selectSession = (session) => {
      this.selectedSession = session;
    }
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
              tel
            }
          }
        }` ,
        variables :{
          sessionId : sessionId
        }
      }).then(res=>{
        this.setsessionusers(res.data.getGuestStatusBySession)
      })
    }
}

const store = new SessionStore();
export default store;
