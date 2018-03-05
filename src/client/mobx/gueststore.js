import { observable, action, computed, useStrict } from 'mobx';
import axios from 'axios';
import { createApolloFetch } from 'apollo-fetch';
import EventStore from './eventstore';
import {REMOTE_DOMAIN_PATH} from './../app/config'


useStrict(true);
const fetch = createApolloFetch({
  uri: REMOTE_DOMAIN_PATH,
});


class UserStore {
    // Values marked as 'observable' can be watched by 'observers'
    @observable users = [];
    @observable loading = true;
    @observable agent_workshop ={};
    @observable agent_session ={};
    @observable selectedUser = null;
    @computed get selectedId() { return this.selectedUser.id; }
    // In strict mode, only actions can modify mobx state
    @action setUsers = (users) => {this.users = [...users];this.loading=false; }
    @action setWorkShop = (workshop) => {this.agent_workshop = workshop; }
    @action setSession = (session) => {this.agent_session = session; }

    @computed get selectWorkshopAgent() { return this.agent_workshop; }

    @action selectUser = (user) => {this.selectedUser = user;}
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
        return role.data.getRoleNameByUserId ;

      }
      @action getUserByID =(userid , callback)=>{
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
            callback(res.data.userId)
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

     if(res.data.getWorkshopByUserId!== null && res.data.getWorkshopByUserId.workshop!=null){
        this.setWorkShop(res.data.getWorkshopByUserId);
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
  @action alterGuestStatus =(guest , status , agent , workshop)=>{
    fetch({
      query:`mutation updateUserStatus($id:ID! , $status:String! , $agent:String! , $workshop:String , $session:String){
        updateUserStatus(id:$id  , status:$status , agent:$agent , workshop:$workshop , session:$session){
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
        workshop:this.agent_workshop!=null? this.agent_workshop._id : null,
        session :this.agent_session!=null? this.agent_session._id : null,

      }
    }).then(res=>{
      //console.log(res)
    })
  }
  @action addAgent=(data)=>{
    fetch({
      query :`mutation addUserWithRole($username:String! , $password:String! ,$rolename:String! , $identifiant:String!){
          addUserWithRole(username:$username , password:$password , rolename:$rolename, identifiant :$identifiant){
            _id
            username
          }
        }`,
      variables:{
        username : data.username ,
        password:data.password ,
        rolename:data.rolename ,
        identifiant: data.identifiant
      }
    })
  }
  @action updateSelectedUserField =(fields)=>{
    for (let key of Object.keys(fields)) {
      if(this.selectedUser.hasOwnProperty(key))
      this.selectedUser[key] = fields[key];
      else{
        if(this.selectedUser.profile.hasOwnProperty(key))
        this.selectedUser.profile[key] = fields[key];

      }
    }
  }
  @action UpdateUserInfoWithProfileData=(userObj)=>{
    this.updateSelectedUserField(userObj);
    fetch({
      query : `mutation updateUserWithProfileData($userObj:UserInput) {
          updateUserWithProfileData(userObj : $userObj) {
            _id
            cin

            profile{
              function
              name
              forname
              avatar
              tel
              region
              gouvernorat

            }
          }
        }` ,
      variables :{
        userObj : JSON.parse(JSON.stringify(this.selectedUser))
      }
    })
  }
}
const store = new UserStore();

export default store;
export { UserStore };
