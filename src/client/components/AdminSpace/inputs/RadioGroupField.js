import React from 'react'
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import { observer } from 'mobx-react';

export default observer(({ field, placeholder = null , data }) => (
  <div>
  <RadioGroup {...field.bind()}>
  {  data.map(choice =>
        <FormControlLabel value={choice.value} control={<Radio />} label={choice.label} />
    )
  }
  </RadioGroup>
  </div>
));
