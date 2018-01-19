import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import {withRouter} from "react-router-dom";
import Dial , { DialPad  }  from './vendor/Dial'
class QReaderComponent extends Component {

  constructor(props){
    super(props)
    this.state = {
      delay: 300,
      result: 'No result',
    }
    this.handleScan = this.handleScan.bind(this);
    this.handleEntryNumber = this.handleEntryNumber.bind(this)

  }
  handleScan(data){
    let r = localStorage.getItem('role');

    if(data){
      this.setState({
        result: data,
      })
      if(r==="agent_in")
      this.props.history.push('/verifyenter/'+data);
      if(r==="agent_out")
      this.props.history.push('/verifyexit/'+data);
      if(r==="agent_workshop"){
        this.props.history.push('/accessoperation/'+data);
      }

    }
  }
  handleEntryNumber(data){
    let r = localStorage.getItem('role');
      if(r==="agent_in")
      this.props.history.push('/verifyenter/'+data);
      if(r==="agent_out")
      this.props.history.push('/verifyexit/'+data);
      if(r==="agent_workshop"){
        this.props.history.push('/accessoperation/'+data);
      }
  }
  handleError(err){
    console.error(err)
  }
  render(){
    return(
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          facingMode="user"
          />
          <Dial handleValid = {this.handleEntryNumber}/>
      </div>
    )
  }
}
export default withRouter(QReaderComponent);
