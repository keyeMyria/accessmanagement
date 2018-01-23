import React from 'react';
import { observer } from 'mobx-react';
import MaterialTextField from './inputs/MaterialTextField';
import MaterialCheckBox from './inputs/MaterialCheckBox';

import Avatar from 'material-ui/Avatar';


const $btn = 'f6 link dim bn br2 ph3 pv2 mr2 dib white bg-dark-blue';
const handleTogleUser=(user)=>{
  console.log('ok')
}
export default observer(({ form , users }) => (
  <form onSubmit={form.onSubmit}>
    <MaterialTextField field={form.$('name')} />
    <ul>{users.map(user=>(
      <li key={user._id} dense button>
        <Avatar alt="" src={`public/assets/avatars/${user.profile.avatar}`} />
          <p>{`${user.profile.name} ${user.profile.forname}`}</p>
          <MaterialCheckBox field={form.$('users')} checked={user._id} />
        </li>
    ))}</ul>
    <br />
    <p>{form.error}</p>
  </form>
));
