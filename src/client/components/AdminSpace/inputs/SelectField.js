import React from 'react';
import { observer } from 'mobx-react';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

const styles ={
  textFieldContainer :{
    margin:'24px 0 16px',
  },
  selectField:{
    maxWidth: 400,
    minWidth: '40vw',
  },
  selectFieldMenu:{
    paddingLeft:'24px',
    paddingRight:'24px',
    width:'100%',
  },
}

export default observer(({ field, store , onChange , valueKey   }) => (
  <div  style={styles.textFieldContainer}>
    <Select
      {...field.bind()}
      onChange={onChange}
      style={styles.selectField}
      autoWidth={true}
      >
    {store.map(value => (
      <MenuItem
        key={value.hasOwnProperty("value")? value.value: value}
        value={value.hasOwnProperty(valueKey) ? value[valueKey] : value}
        style={styles.selectFieldMenu}
      >
        {value.hasOwnProperty("label") ? value.label : value}
      </MenuItem>
    ))}</Select>
  </div>
));
