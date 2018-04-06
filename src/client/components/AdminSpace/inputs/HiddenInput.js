import React from 'react';
import { observer } from 'mobx-react';

export default observer(({ field , value}) => (
    <input
     {...field.bind()}
     value={value}
   />
));
