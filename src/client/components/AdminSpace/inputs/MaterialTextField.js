import React from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
// styles
const $input = 'input-reset ba b--black-10 br1 pa2 mb2 db w-100 f6';
const $label = 'f7 db mb2 mt3 light-silver';
const $small = 'f6 black-60 db red';

export default observer(({ field, type = 'text', placeholder = null }) => (
  <div className="measure">
    <TextField
     {...field.bind({ type, placeholder })}
   />
    <small className={$small}>
      {field.error}
    </small>
  </div>
));
