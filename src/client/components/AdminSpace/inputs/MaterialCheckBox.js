import React from 'react';
import { observer } from 'mobx-react';
import Checkbox from 'material-ui/Checkbox';


export default observer(({ field, placeholder = null }) => (
  <div>
   <Checkbox
      {...field.bind({ type, placeholder })}
   />
    <small>
      {field.error}
    </small>
  </div>
));
