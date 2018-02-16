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
import EditGuestForm from './EditGuestForm';
import {Link} from 'react-router-dom';
import Phone from 'material-ui-icons/Phone';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
//import editguest from '../../'
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
    const {data , readonly}=this.props
    return(


            <div><input id={`message-${data._id}`} type='checkbox' />
            <label htmlFor={`message-${data._id}`} href='#move'>
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
                {readonly &&(
                  <div><Button disabled >
                    <Phone />
                    {data.profile.tel}
                  </Button>
                  <Link to={`/useractivity/${data._id}`}><Button  raised="true"color="secondary" ><SwapHoriz />
                   الاطلاع على التحركات
                 </Button></Link></div>
                )}
                <Button dense="true" color="primary" onClick={() => console.log('ok')}>
                  export Badge
                </Button>
              </div>
            {!readonly &&(
              <div className='container_ui__expand' id='close'>
                 <div className='heading'>
                   <div className='heading_head'></div>
                 </div>
                 <div className='body'>
                   <div className='user'>
                     <div className='face'>
                       <img src={`public/assets/avatars/${data.profile.avatar}`}  />
                     </div>
                     <div className='details'>
                       <h2> {data.identifiant}  {data.profile.name} {data.profile.forname}</h2>
                       <h3>Edit Personal Informations</h3>
                     </div>
                   </div>
                   <div className='content'>
                     {/* <form>
                                <TextField name="name" type="text"  label=" الأسم " onBlur={(event)=>this.updatevalues('forname' ,event)} defaultValue={data.profile!=undefined ? data.profile.name : ''} />

                                <TextField name="forname" type="text"  label=" اللقب " onBlur={(event)=>this.updatevalues('name' ,event)} defaultValue={data.profile!=undefined ? data.profile.forname : ''}/>

                                <TextField name="cin" type="text" onBlur={(event)=>this.updateUservalues('cin' ,event)} defaultValue={data!=undefined ? data.cin : ''} label=" رقم بطاقة التعريف الوطنية "/>

                                <TextField name="tel" type="" onBlur={(event)=>this.updatevalues('tel' ,event)} defaultValue={data.profile!=undefined ? data.profile.tel : ''} label=" الهاتف "/>

                                 <Select name ="function"
                                   onChange={(event)=>this.updatevalues('function' ,event)}
                                  label=" الصفة " value=''>
                                 {whatido.map(value => (
                                   <MenuItem
                                     key={value.value}
                                     value={value.label}
                                   >
                                     {value.label}
                                   </MenuItem>
                                 ))}</Select>

                                 <FormControl>
                               <InputLabel htmlFor="name-multiple" >الولاية</InputLabel>
                                <Select
                                  onChange={(event)=>this.updatevalues('region' ,event)}
                                  value=''
                                  input={<Input id="name-multiple" />}

                                >
                                  {gouvernement.map(city => (
                                    <MenuItem
                                      key={city.value}
                                      value={city.value}
                                    >
                                      {city.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                          </FormControl>

                          <FormControl>
                            <InputLabel htmlFor="name-multiple" >المعتمدية</InputLabel>
                             <Select
                               onChange={(event)=>this.updatevalues('gouvernorat' ,event)}
                               input={<Input id="name-multiple" />}
                               value=''
                             >
                               {this.state.govSource.map(value => (
                                 <MenuItem
                                   key={value}
                                   value={value}
                                 >
                                   {value}
                                 </MenuItem>
                               ))}
                             </Select>
                         </FormControl>
                           <Button dense="true" color="primary" onClick={this.updateUserWithProfileDataMutationTarget}>
                             Save
                           </Button>
                           <Button dense="true" color="primary" onClick={() => { this.exportPDF(this.state.selected_user)}}>
                             export Badge
                           </Button>
                           <Button dense="true" color="primary" onClick={() => { this.exportAll()}}>
                             Export All
                           </Button>
                           <IconButton onClick={this.handleClickOpenRemoveConfirm} aria-label="Delete" color="primary">
                             <Delete />
                           </IconButton>
                         </form> */}
                   </div>
                 </div>
               </div>
            )}
            </label></div>
        )
  }
}
export default GuestCardToManage;
