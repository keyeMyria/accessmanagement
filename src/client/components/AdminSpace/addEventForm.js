import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialDatePicker from './inputs/MaterialDatePicker';

const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';

export default observer(({ form , onSuccess }) => (
  <form onSubmit={form.onSubmit}>
    <MaterialTextField field={form.$('title')} />
    <MaterialTextField field={form.$('type')} />
    <MaterialTextField field={form.$('place')} />
    <MaterialTextField field={form.$('numberAttendies')} />
    <MaterialDatePicker field={form.$('start_date')}/>
    <MaterialDatePicker field={form.$('end_date')}/>

    <br />
    <p>{form.error}</p>
  </form>
));
