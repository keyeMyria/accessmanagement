import { observable, action, computed, useStrict } from 'mobx';
import axios from 'axios';
import { createApolloFetch } from 'apollo-fetch';
useStrict(true);


const fetch = createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});



class UserStore {
    // Values marked as 'observable' can be watched by 'observers'
    @observable users = [];
    @observable selectedUser = {};
    @computed get selectedId() { return this.selectedUser.id; }
    // In strict mode, only actions can modify mobx state
    @action setUsers = (users) => {this.users = [...users]; }
    @action selectUser = (user) => { this.selectedUser = user; }
    // Managing how we clear our observable state
    @action clearSelectedUser = () => { this.selectedUser = {}; }
    // An example that's a little more complex
    @action getUsers() {
  	//Managing Async tasks like ajax calls with Mobx actions
    fetch({
      query: `query guestlist {
        guestusers {
          _id
          username
          status
          cin
          identifiant
          profile{
            _id
            function
            name
            forname
            avatar
            tel
            region
            gouvernorat

          }

        }
      }`,
    }).then(res => {
      this.setUsers(res.data.guestusers);
    });
      }
}

const store = new UserStore();

export default store;
export { UserStore };
