import React from 'react';
import { observer } from 'mobx-react';

export default observer(({ field}) => (
    <input
     {...field.bind()}
   />
));
