import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialDatePicker from './inputs/MaterialDatePicker';
import FileInput from './inputs/FileInput';
const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';

@observer
export default class AddEventForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      startDate:new Date(),
      valueFin :new Date(),
      valueDebut: new Date(),
    }
  }
  SetEndDateMin = (value)=>{
    this.setState({
      valueFin:value,
      valueDebut: value
    })
  }
  setStartDate=(value)=>{
    this.setState({
      valueFin:value
    })
  }
  render(){
    const {form , onSuccess} = this.props;
    return( <form onSubmit={form.onSubmit}>
      <MaterialTextField field={form.$('title')} />
      <MaterialTextField field={form.$('type')} />
      <MaterialTextField field={form.$('place')} />
      <div className="DateMainContainer">
        <div className="DateFieldContainer">
          <div className="LabelTimePicker">من</div>
          <MaterialDatePicker field={form.$('start_date')} value={this.state.valueDebut} disablePast={true} onChange={this.SetEndDateMin} />
        </div>
        <div className="DateFieldContainer">
          <div className="LabelTimePicker">الى</div>
          <MaterialDatePicker field={form.$('end_date')} value={this.state.valueFin} minDate={this.state.valueDebut} onChange={this.setStartDate}/>
        </div>
      </div>
      <FileInput required field={form.$('file')} form={form} />
      <br />
      <p>{form.error}</p>
    </form>)
  }
}
