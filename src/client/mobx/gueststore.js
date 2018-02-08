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
    @observable loading = true;
    @observable agent_workshop ={};
    @observable selectedUser = {};
    @computed get selectedId() { return this.selectedUser.id; }
    // In strict mode, only actions can modify mobx state
    @action setUsers = (users) => {this.users = [...users];this.loading=false; }
    @action setWorkShop = (workshop) => {this.agent_workshop = workshop; }
    @computed get selectWorkshopAgent() { return this.agent_workshop; }

    @action selectUser = (user) => {this.selectedUser = user; }
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
      @action fetchUserRole = async (userid)=>{
        const role= await fetch({
          query: `query getRoleNameByUserId($id : ID) {
            getRoleNameByUserId(id : $id) {
              _id
              workshop{
                session_empty
              }
              session{
                stat
              }
              role{
                name
              }

            }
          }`,
          variables :{
            id : userid
          }
        })
        //console.log(role.data.getRoleNameByUserId)
        return role.data.getRoleNameByUserId ;

      }
      @action getUserByID =(userid)=>{
       fetch({
          query:`query userId($id:String){
            userId(id:$id){
              username
              _id
              profile {
                name
                forname
                avatar
              }

            }
          }
          ` ,
          variables :{
            id : userid
          }
        }).then(res=>{
          if(res.data!=null){
            this.selectUser(res.data.userId)
          }
        })
    }
    @action affectUserToSession =(userid , sessionId)=>{
     fetch({
        query:`mutation SwitchAgentSession($id:ID! , $sessionId:ID!){
          SwitchAgentSession(id:$id , sessionId: $sessionId){
            username
            _id
            profile {
              name
              forname
              avatar
            }

          }
        }
        ` ,
        variables :{
          id : userid ,
          sessionId:sessionId
        }
      }).then(res=>{
        console.log(res)
      })
  }
  @action fetchGuestForAgentWorkshop=(userid)=>{
    fetch({
     query : `query getWorkshopByUserId($id : ID!){
       getWorkshopByUserId(id :$id){
         _id
         workshop{
           _id
           name
           users{
             _id
             username
             status
             profile{
               name
               forname
               avatar
             }
           }
         }
       }

     }`,
     variables :{
       id : userid
     }
   }).then(res=>{
     this.setWorkShop(res.data.getWorkshopByUserId);
     this.setUsers(res.data.getWorkshopByUserId.workshop.users)
   })
  }
  @action alterGuestStatus =(guest , status , agent , workshop)=>{
    fetch({
      query:`mutation updateUserStatus($id:ID! , $status:String! , $agent:String! , $workshop:String!){
        updateUserStatus(id:$id  , status:$status , agent:$agent , workshop:$workshop){
          _id
          username
          status
          profile{
            name
            forname
            avatar
          }
        }
      }`,
      variables :{
        id : guest ,
        status : status ,
        agent : agent,
        workshop:workshop
      }
    }).then(res=>{
      //console.log(res)
    })
  }
}
const store = new UserStore();

export default store;
export { UserStore };
