import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialDatePicker from './inputs/MaterialDatePicker';
import FileInput from './inputs/FileInput';
const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';

export default observer(({ form , data ,  onSuccess , formData}) => (
  <form onSubmit={form.onSubmit} formData={formData}>
    <MaterialTextField field={form.$('name')} value={formData.profile.name}/>
    <MaterialTextField field={form.$('forname')} value={formData.profile.forname}/>
    <MaterialTextField field={form.$('cin')} value={formData.cin}/>
    <MaterialTextField field={form.$('tel')} value={formData.profile.tel}/>
    <MaterialTextField field={form.$('function')} value={formData.profile.function}/>
    <MaterialTextField field={form.$('region')} value={formData.profile.region}/>
    <MaterialTextField field={form.$('gouvernorat')} value={formData.profile.gouvernorat}/>


    <br />
    <p>{form.error}</p>
  </form>
));
