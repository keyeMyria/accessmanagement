import React from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
// styles
const $input = 'input-reset ba b--black-10 br1 pa2 mb2 db w-100 f6';
const $label = 'f7 db mb2 mt3 light-silver';
const $small = 'f6 black-60 db red';
const styles ={
  textFieldContainer :{
    margin:'24px 0 16px',
  },
  aTextField:{
    width:'100%',
  },
}

export default observer(({ field, type = 'text', placeholder = null }) => (
  <div className="measure" style={styles.textFieldContainer}>
    <TextField style={styles.aTextField}
     {...field.bind({ type, placeholder })}
     helperText={field.error}
   />
  </div>
));
