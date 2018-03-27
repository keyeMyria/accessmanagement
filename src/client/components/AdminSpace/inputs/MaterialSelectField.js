import React , {Fragment} from 'react';
import { observer } from 'mobx-react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import update from 'immutability-helper'
import {REMOTE_ASSETS_PATH} from '../../../app/config'

// styles
const $input = 'input-reset ba b--black-10 br1 pa2 mb2 db w-100 f6';
const $label = 'f7 db mb2 mt3 light-silver';
const $small = 'f6 black-60 db red';
const styles ={
  guestItem :{
    padding : '8px',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    textAlign:'right',
  } ,
  avatarGuest :{
    width : '40px' ,
    height : '40px' ,
    marginLeft:'8px',
  },
  guestName :{
    fontWeight : '0.8em',
  },
  chipsContainer:{
    border : '2px solid #eee',
    borderRadius:'2px',
    minHeight: '40px',
    padding:'8px',
    marginTop:'16px',
  },
  GuestContainer:{
    padding:'8px',
    background:'#eee',
    display:'flex',
    flexDirection:'column',
  },
  guestCounter:{
      margin : '8px',
      color:'#acacac',
  },
  guestChip:{
        margin : '3px',
    },
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
      names : [],
      numberguest : 0


    };
  }
  handleAddGuest = (item , index) => {
    this.setState((prevState) => ({
      invited: update(prevState.invited, {$splice: [[index, 1]]}) ,
      chipData : update(prevState.chipData, {$push: [ item ]}) ,
      names : update(prevState.names, {$push: [ item._id ]}) ,
      numberguest : prevState.numberguest+1

  }))
  this.props.form.$('users').value = this.state.names

 };
 handleDeleteChip = (item , index) => {

   this.setState((prevState) => ({
     chipData: update(prevState.chipData, {$splice: [[index, 1]]}) ,
     invited : update(prevState.invited, {$push: [ item ]}) ,
     names: prevState.names.filter(i => {
       return i !== item._id
     }),
     numberguest : prevState.numberguest-1
 }))
 this.props.form.$('users').value = this.state.names
};

  render(){
    const { field , placeholder , type ,form} = this.props;
    return(
        <Fragment>
              <div>
                <div style={styles.chipsContainer}>

                  {this.state.chipData.map((data , index) => {

                        <Chip
                        key={`{chip${data._id}}`}
                        avatar={<Avatar src={`${REMOTE_ASSETS_PATH}/${data.profile.avatar}`} />}
                        label={`${data.profile.name} ${data.profile.forname}`}
                        onDelete={()=>this.handleDeleteChip(data , index)}
                        style={styles.guestChip}
                      />
                    
                    
                  })}
                  <p style={styles.guestCounter}>أضف المشاركين للورشة : {this.state.numberguest}</p>
                  </div>
                  <ul style={styles.GuestContainer}>

                        {this.state.invited.map((item , index) => (

                          <li onClick={()=>this.handleAddGuest(item , index)} key={item._id} style={styles.guestItem}>
                                  {(item.profile!=null)&&(
                                  <Avatar
                                    src={`${REMOTE_ASSETS_PATH}/${item.profile.avatar}`}
                                    style={styles.avatarGuest}
                                  />)}
                                  {(item.profile!=null)&&(<p style={styles.guestName}> {item.profile.name} {item.profile.forname}</p>)}
                          </li>

                        ))}
                      </ul>
                      <Input {...field.bind({type})} value={this.state.names}/>
                    </div>
              </Fragment>
            )
  }
}
export default MaterialSelectField;
