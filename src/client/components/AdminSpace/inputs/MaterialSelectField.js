import React from 'react';
import { observer } from 'mobx-react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import update from 'immutability-helper'
// styles
const $input = 'input-reset ba b--black-10 br1 pa2 mb2 db w-100 f6';
const $label = 'f7 db mb2 mt3 light-silver';
const $small = 'f6 black-60 db red';
const values = [];
const handleNameChange=(event)=>{
  values.push(event.target.value);
  console.log(values)


}
const invited=[];
@observer
class MaterialSelectField extends React.Component{
  constructor(props){
    super(props)

    this.props.items.map(item=>{
      invited.push(item);
    });
    this.state = {
      chipData: [],
      invited : invited,
      names : []

    };
  }
  handleAddGuest = (item , index) => {
    this.setState((prevState) => ({
      invited: update(prevState.invited, {$splice: [[index, 1]]}) ,
      chipData : update(prevState.chipData, {$push: [ item ]}) ,
      names : update(prevState.names, {$push: [ item._id ]}) ,
  }))
 };
 handleDeleteChip = (item , index) => {

   this.setState((prevState) => ({
     chipData: update(prevState.chipData, {$splice: [[index, 1]]}) ,
     invited : update(prevState.invited, {$push: [ item ]}) ,
     names: prevState.names.filter(i => {
       return i !== item._id
     })
 }))
};
  render(){
    const { field , placeholder } = this.props;
    return(
      <div>
        <Paper>
          {this.state.chipData.map((data , index) => {
            return (
              <Chip
                key={`{chip${data._id}}`}
                avatar={<Avatar src={`public/assets/avatars/${data.profile.avatar}`}/>}
                label={`${data.profile.name} ${data.profile.forname}`}
                onDelete={()=>this.handleDeleteChip(data , index)}
              />
            );
          })}
          </Paper>
          <List>

                {this.state.invited.map((item , index) => (

                  <ListItem onClick={()=>this.handleAddGuest(item , index)} key={item._id} dense button>
                          <Avatar src={`public/assets/avatars/${item.profile.avatar}`} />
                          <ListItemText primary={`${item.profile.name} ${item.profile.forname}`} />
                        </ListItem>

                ))}
              </List>
              <input type="hidden" {...field.bind({  placeholder })} value={this.state.names} />
            </div>

    )
  }
}
export default MaterialSelectField;
