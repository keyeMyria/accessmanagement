import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import RadioGroupField from './inputs/RadioGroupField';

const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';
const roles=[{
  "label":"دخول" , 
  "value":"agent_in"
} , {
  "label":"خروج" , 
  "value":"agent_out"
} ,{
  "label":"خروج/دخول" , 
  "value":"agent_in_out"
}]
export default observer(({ form , onSuccess }) => (
  <form onSubmit={form.onSubmit} >
    <MaterialTextField field={form.$('username')} />
    <MaterialTextField field={form.$('password')} />
    <RadioGroupField field={form.$('rolename')} data={roles} />
    <MaterialTextField field={form.$('identifiant')}/>
    <br />
    <p>{form.error}</p>
  </form>
));
