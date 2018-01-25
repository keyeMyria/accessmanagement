import React from 'react';
import { observer } from 'mobx-react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { ListItemText } from 'material-ui/List';
import Select from 'material-ui/Select';
import Avatar from 'material-ui/Avatar';

import Checkbox from 'material-ui/Checkbox';
// styles
const $input = 'input-reset ba b--black-10 br1 pa2 mb2 db w-100 f6';
const $label = 'f7 db mb2 mt3 light-silver';
const $small = 'f6 black-60 db red';
const values = [];
const handleNameChange=(event)=>{
  values.push(event.target.value);
  console.log(values)


}
@observer
class MaterialSelectField extends React.Component{
  constructor(props){
    super(props)
    this.state={
      names : []
    }
  }
  handleNameChange = event => {
   this.setState({ names: event.target.value });
   console.log(this.state)
 };
  render(){
    const { field , placeholder , items} = this.props;
    console.log(field)
    return(
      <div className="measure">
        <Select
              {...field.bind()}
                multiple
                input={<Input id="name-multiple"/>}
                onChange={this.handleNameChange}
                value={this.state.names}
              >
                {items.map(item => (
                  <MenuItem
                    key={item._id}
                    value={item._id}
                  >
                    <Avatar alt="" src={`public/assets/avatars/${item.profile.avatar}`} />
                      <p>{`${item.profile.name} ${item.profile.forname}`}</p>
                  </MenuItem>
                ))}
              </Select>
        <small className={$small}>
          {field.error}
        </small>
      </div>
    )
  }
}
export default MaterialSelectField;
