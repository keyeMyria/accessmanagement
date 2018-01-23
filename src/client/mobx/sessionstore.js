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
    @observable selectedSession = {};
    @computed get selectedId() { return this.selectedSession.id; }
    // In strict mode, only actions can modify mobx state
    @action setSessions = (sessions) => {this.sessions = [...sessions]; }
    @action selectSession = (session) => { this.selectedSession = session; }
    // Managing how we clear our observable state
    @action clearSelectedSession = () => { this.selectedSession = {}; }
    // An example that's a little more complex
    @action getSessions() {
  	//Managing Async tasks like ajax calls with Mobx actions
    fetch({
      query: `query getActiveSessions {
        getActiveSessions {
        _id
        start_hour
        end_hour
        workshop{
          _id
          name
        }
        }
      }`,
    }).then(res => {
      if(res.data.getActiveSessions!=null){
        this.setSessions(res.data.getActiveSessions);
      }
      });
      }
}

const store = new SessionStore();

export default store;
export { SessionStore };
