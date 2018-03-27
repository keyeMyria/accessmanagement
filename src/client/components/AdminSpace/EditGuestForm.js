import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialDatePicker from './inputs/MaterialDatePicker';
import HiddenInput from './inputs/HiddenInput';
import Button from 'material-ui/Button';
import gouvernement  , {whatido} from './vendor/states';
import SelectField from './inputs/SelectField';

const styles ={
  formEditGuest :{
    textAlign:'right',
  },
}

@observer
export default class EditGuestForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      dataSource :gouvernement ,
      govSource : [] ,

    }
  }
updateStore =(e)=>{
  console.log(e.target.value)
  let item = this.state.dataSource.filter(function (el) {
    return el.value == e.target.value
  });
  this.setState({
    govSource : item[0].govs
  })
    this.handleupdateValue('region' , e.target.value)
}
  handleupdateValue =(field , value)=>{
    this.props.form.$(field).value = value;
  }
  render(){
    const { form , data ,  onSuccess , user}=this.props;
    return (
      <form style={styles.formEditGuest}>
      <MaterialTextField field={form.$('name')} />
      <MaterialTextField field={form.$('forname')}/>
      <MaterialTextField field={form.$('cin')} />
      <MaterialTextField field={form.$('tel')} />
      <SelectField field={form.$('function')} store={whatido} onChange={(event)=>this.handleupdateValue('function' , event.target.value)} valueKey="label"/>
      <SelectField field={form.$('region')} store={this.state.dataSource}  value={user.profile.region} onChange={(event)=>this.updateStore(event)} valueKey="value"/>
      <SelectField field={form.$('gouvernorat')} store={this.state.govSource}   onChange={(event)=>this.handleupdateValue('gouvernorat' , event.target.value)} valueKey="value"/>
      <HiddenInput field={form.$('_id')} />

      <br />
      <p>{form.error}</p>
    </form>)
  }
}
