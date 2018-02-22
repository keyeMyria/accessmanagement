import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialDatePicker from './inputs/MaterialDatePicker';
import HiddenInput from './inputs/HiddenInput';
import Button from 'material-ui/Button';

@observer
export default class EditGuestForm extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    const { form , data ,  onSuccess , user}=this.props;
    return (
      <form >
      <MaterialTextField field={form.$('name')} />
      <MaterialTextField field={form.$('forname')}/>
      <MaterialTextField field={form.$('cin')} />
      <MaterialTextField field={form.$('tel')} />
      <MaterialTextField field={form.$('function')} />
      <MaterialTextField field={form.$('region')}/>
      <MaterialTextField field={form.$('gouvernorat')} />
      <HiddenInput field={form.$('_id')} />

      <br />
      <p>{form.error}</p>
    </form>)
  }
}
