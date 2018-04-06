import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialDatePicker from './inputs/MaterialDatePicker';
import FileInput from './inputs/FileInput';
const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';

@observer
export default class AddEventForm extends React.Component{
  SetEndDateMin = (value)=>{
    console.log(value)
  }
  render(){
    const {form , onSuccess} = this.props;
    return( <form onSubmit={form.onSubmit}>
      <MaterialTextField field={form.$('title')} />
      <MaterialTextField field={form.$('type')} />
      <MaterialTextField field={form.$('place')} />
      <MaterialDatePicker field={form.$('start_date')} onChange={this.SetEndDateMin()}/>
      <MaterialDatePicker field={form.$('end_date')} minDate={form.$('start_date').value}/>
      <FileInput field={form.$('file')} form={form}/>
      <br />
      <p>{form.error}</p>
    </form>)
  }
}
