import React from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';

const styles ={
  textFieldContainer :{
    margin:'24px 0 16px',
  },
  aTextField:{
    width:'100%',
  },
}

export default observer(({ field, type = 'text', placeholder = null }) => (
  <div  style={styles.textFieldContainer}>
    <TextField style={styles.aTextField}
     {...field.bind({ type, placeholder })}
     helperText={field.error}
     value={field.value}
     label="عنوان الورشة"
     placeholder= "أضف عنوان الورشة"
   />
  </div>
));
