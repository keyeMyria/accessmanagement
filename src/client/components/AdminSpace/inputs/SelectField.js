import React from 'react';
import { observer } from 'mobx-react';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

const styles ={
  textFieldContainer :{
    margin:'24px 0 16px',
  },
  aTextField:{
    width:'100%',
  },
}

export default observer(({ field, store , onChange , valueKey  }) => (
  <div  style={styles.textFieldContainer}>
    <Select
      {...field.bind()}
      onChange={onChange}
      >
    {store.map(value => (
      <MenuItem
        key={value.hasOwnProperty("value")? value.value: value}
        value={value.hasOwnProperty(valueKey) ? value[valueKey] : value}
      >
        {value.hasOwnProperty("label") ? value.label : value}
      </MenuItem>
    ))}</Select>
  </div>
));
