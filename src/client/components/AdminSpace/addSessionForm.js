import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';

import HiddenInput from './inputs/HiddenInput';
import Avatar from 'material-ui/Avatar';


const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';
@observer
export default class SessionForm extends React.Component{
  constructor(props){
    super(props);
    props.form.$('eventid').value=props.eventid;
    
  }
  render(){
    const { form , eventid} = this.props
    return(
      <form onSubmit={form.onSubmit}>
      <MaterialTextField field={form.$('title')} />
      <HiddenInput field={form.$('eventid')} value={eventid}/>
      <br />
      <p>{form.error}</p>
    </form>
    )
  }
}

