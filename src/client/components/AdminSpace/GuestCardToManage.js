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
import {Link} from 'react-router-dom';
import Phone from 'material-ui-icons/Phone';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import { withStyles } from 'material-ui/styles';
import UserStore from '../../mobx/gueststore';
import {observer} from 'mobx-react'

const styles = theme => ({
  phoneNbr:{
    fontFamily:'Roboto, sans-serif',
  }

});
@observer
class GuestCardToManage extends React.Component{
  constructor(props){
    super(props);


  }
  render(){
    const {classes, data , readonly}=this.props
    return(



            <div>
              {!readonly &&(
                <input id={`message-${data._id}`} type='Checkbox' onChange={()=>UserStore.selectUser(this.props.data)}/>
              )}
            <label className='labelGuestList' htmlFor={`message-${data._id}`} href='#move'>
              <div className='container_ui__item'>
                <div className='face'>
                  <img src={`public/assets/avatars/${data.profile.avatar}`} />
                  <div className='color_bar one'>
                    <div className='infosActive'>
                      <h2>{data.profile.name} {data.profile.forname}</h2>
                      <h3>{data.identifiant}</h3>
                    </div>
                    <span>Read</span>

                  </div>
                </div>

                <div className={!readonly ? "itemInfos" :"itemInfosResponsive"}>
                  <h2>
                    {data.profile.name} {data.profile.forname}
                  </h2>
                  <h3> {data.identifiant} 1234 </h3>
                </div>

                {readonly &&(
                  <div className="itemActions">
                    <Button disabled className={classes.phoneNbr}>
                      <Phone />
                      {data.profile.tel}
                    </Button>
                    <Link to={`/useractivity/${data._id}`}><Button color="secondary" ><SwapHoriz />
                     الاطلاع على التحركات
                    </Button></Link></div>
                  )}

                 </div>

            )}
            </label></div>
        )
  }
}
export default withStyles(styles) (GuestCardToManage);
