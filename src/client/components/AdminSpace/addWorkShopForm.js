import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialCheckBox from './inputs/MaterialCheckBox';
import MaterialSelectField from './inputs/MaterialSelectField';

import Avatar from 'material-ui/Avatar';


const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';
const handleTogleUser=(user)=>{
  console.log('ok')
}
export default observer(({ form , users }) => {
  return(
  <form onSubmit={form.onSubmit}>
    <MaterialTextField field={form.$('name')} />
    <MaterialSelectField items={users} field={form.$('users')} form ={form}/>
    <br />
    <p>{form.error}</p>
  </form>
)});
