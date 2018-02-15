import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialDatePicker from './inputs/MaterialDatePicker';
import FileInput from './inputs/FileInput';
const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';

export default observer(({ form , data ,  onSuccess }) => (
  <form onSubmit={form.onSubmit}>
    <MaterialTextField field={form.$('name')} />
    <MaterialTextField field={form.$('forname')} />
    <MaterialTextField field={form.$('cin')} />
    <MaterialTextField field={form.$('tel')}/>
    <MaterialTextField field={form.$('function')}/>
    <MaterialTextField field={form.$('region')}/>region
    <MaterialTextField field={form.$('gouvernorat')}/>region
    <MaterialTextField field={form.$('region')}/>region


    <br />
    <p>{form.error}</p>
  </form>
));
