import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import {withRouter} from "react-router-dom";
import Dial , { DialPad  }  from './vendor/Dial'
import {observer} from 'mobx-react'
import UserStore from '../../mobx/gueststore';
import './vendor/agent.css'
@observer
class QReaderComponent extends Component {

  constructor(props){
    super(props)


    this.state = {
      delay: 300,
      result: 'No result'
    }
    this.handleScan = this.handleScan.bind(this);
    this.handleEntryNumber = this.handleEntryNumber.bind(this)

  }
  verifySession=(data)=>{
    if(data.workshop==null && data.workshop==null)
      return false ;
    if(data.workshop.session_empty==true && data.session.stat=='OFF')
      return false
    return true;
  }
  handleScan(data){


    let id = localStorage.getItem('loogedin_id');
    let fetched_user = UserStore.fetchUserRole(id);
    fetched_user.then(res=>{
      let role = res.role.name ;
      if(data){
        this.setState({
          result: data,
        })
        if(this.verifySession(res)){
          if(role==="agent_in")
          this.props.history.push('/verifyenter/'+data);
          if(role==="agent_out")
          this.props.history.push('/verifyexit/'+data);
          if(role==="agent_workshop"){
            this.props.history.push('/accessoperation/'+data);
          }
        }
        else{
          console.log('you\'re not connected to any session')
        }


      }
    })

  }
  handleEntryNumber(data){
    let id = localStorage.getItem('loogedin_id');
    let fetched_user = UserStore.fetchUserRole(id);
    fetched_user.then(res=>{
      console.log(res)
      let role = res.role.name ;
      if(data){
        this.setState({
          result: data,
        })
        if(this.verifySession(res)){
          if(role==="agent_in")
          this.props.history.push('/verifyenter/'+data);
          if(role==="agent_out")
          this.props.history.push('/verifyexit/'+data);
          if(role==="agent_workshop"){
            this.props.history.push('/accessoperation/'+data);
          }
        }
        else{
          console.log('you\'re not connected to any session')
        }

      }
    })
  }
  handleError(err){
    console.error(err)
  }
  render(){
    return(
      <div className="containerQrcodeDail">
        <QrReader
          className="section"
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          facingMode="user"
          />
          <Dial className="section" handleValid = {this.handleEntryNumber}/>
      </div>
    )
  }
}
export default withRouter(QReaderComponent);
