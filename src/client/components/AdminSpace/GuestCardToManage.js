import React from 'react';
import './vendor/testlist.css';
import Grid from 'material-ui/Grid';
import Input, { InputLabel, InputAdornment  } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import gouvernement  , {whatido} from './vendor/states'
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/Delete';
import UserStore from '../../mobx/gueststore';
import {observer} from 'mobx-react';

@observer
class GuestCardToManage extends React.Component{
  constructor(props){
    super(props);
    this.state  = {
        checked: [1] ,
        total :0 ,
        attendies_list : [],
        unfiltered_list : [],
        dataSource : gouvernement ,
        govSource : [] ,
        searchText :'',
        city : '',
        region :'' ,
        job :'',
        expanded :null,
        selected_user : {
          _id : 'default',
          cin : 'default',
          identifiant:'',
          profile:{
            _id :'default',
            name :'default',
            forname:'default',
            tel :'default',
            region:'default',
            gouvernorat:'default',
            avatar:'default'

          }
        } ,

      };


  }
  render(){
    const {data}=this.props
    return(


            <div><input id={`message-${data._id}`} type='checkbox' />
            <label htmlFor={`message-${data._id}`} href='#move'  onClick={()=>UserStore.selectUser(data)}>
              <div className='container_ui__item'>
                <div className='face'>
                  <img src={`public/assets/avatars/${data.profile.avatar}`} />
                  <div className='color_bar one'>
                    <p>{data.identifiant}  {data.profile.name} {data.profile.forname}</p>
                    <span>Read</span>

                  </div>
                </div>
                <h2>
                  {data.identifiant}  {data.profile.name} {data.profile.forname}
                </h2>
                <h3> {data.identifiant}  {data.profile.name} {data.profile.forname}</h3>
                <h4>Your generous donation saved 3 million puppies...</h4>
              </div>

            </label></div>
        )
  }
}
export default GuestCardToManage;
