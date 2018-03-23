import React, { Component } from 'react'
import {withRouter} from "react-router-dom";
import { Field, reduxForm ,reset } from 'redux-form';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import Radio, { RadioGroup } from 'material-ui/Radio';
import AvatarCropper from './AvatarCropper';
import classNames from 'classnames';
import BackAddUser from './BackAddUser.svg';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import "./vendor/addUser.css";
import Input, { InputLabel, InputAdornment  } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import Call from 'material-ui-icons/Call';
import WebAsset from 'material-ui-icons/WebAsset'
import gouvernement  , {whatido} from './vendor/states'
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';




const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 200,
    },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
  container_select: {
   display: 'flex',
   flexWrap: 'wrap',
 },
 formControl: {
   margin: 'theme.spacing.unit',
   minWidth: 120,
   maxWidth: 300,
 },
});


const selectStyle = {
  minWidth: '120px',
  maxWidth: '300px',
  width: '222px',
};
const container = {
    overflow: 'auto',
    marginBottom: '56px',
};


function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

const backgroundAddUser = {
    width: '100vw',
    backgroundColor:'#003489',
    position: 'absolute',
    height: '160px',
    top: '56px',
    left: '0',
  };

  const whiteBackground = {
      backgroundColor:'#fff',
      position: 'fixed',
      height: '112px',
      width: '100vw',
      bottom:'0',
    };

  const titleAddUser = {
      color:'#fff',
      marginTop: '100px',
      textAlign: 'right',
      zIndex: '0',
    };
    const formAddUser = {
      width: '80vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginLeft: 'auto',
      marginRight: 'auto',
    };

    const subContainerAddUser = {
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: '#fff',
      display: 'flex',
<<<<<<< HEAD
      flexDirection: 'row' 
=======
      flexDirection: 'row',
>>>>>>> 3982ae93b3f4c4f2cb484c0645144a565387c76e
    };
    const styleinputForm ={
      width: '300px',
      marginTop: '24',
      textAlign:'right',
    };
    const styleBottomForm ={
      marginTop: '24px',
    };
    const styleAutosuggest ={
      marginTop: '15px',
    };

    const styleSmallInput ={
        marginTop: '24px',
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;


class AddUserFormComponent extends Component {
  renderErrors = (errors) => (
    <div className="alert alert-danger" role="alert">
      {errors.map((error, index) => <span key={index}>{error.value}</span>)}
    </div>
  );
  state = {
    name: [],
    value: '',
    dataSource : gouvernement ,
    CitySource : [] ,
    searchText :'',
    city : '',
    region :'' ,
    job :''
  };
  handleChange = event => {
  this.setState({ name: event.target.value });
  };
  handleCrop = ()=>{

  }
  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
  };

  handleNewRequest = () => {
    this.setState({
      searchText: '',
    });
  };
  renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
  }) =>{
    return (
    <TextField
       placeholder={label}
      //hintText={label}
      label ={label}
      //floatingLabelText={label}
      //errorText={touched && error}
      {...input}
      {...custom}
    />
  );
}
  renderCheckbox = ({ input, label }) => (
    <Checkbox
      label={label}
      checked={input.value ? true : false}
      onCheck={input.onChange}
    />
  )
  renderRadioGroup = ({ input, ...rest }) => (
    <RadioGroup
      {...input}
      {...rest}
      valueSelected={input.value}
      onChange={(event, value) => input.onChange(value)}
    />
  )
  renderSelectField = ({
    input,
    label,
    meta: { touched, error },
    children,
    ...custom
  }) => (
    <FormControl>
    <InputLabel htmlFor="name-multiple">{label}</InputLabel>
     <Select
       {...input}
       onChange={(event, index, value) => this.handleSelectJob(event)}
       children={children}
       value={this.state.job}
       MenuProps={{
         PaperProps: {
           style: {
             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
             width: 300,
           },
         },
       }}
     >
     </Select>
   </FormControl>
  )
  setSuccessResponse =(value)=>{

    this.props.setSuccessResponse(value)
    this.setState({
      avatar_file : value
    });
}


  handleChangeAuto  = (event, { newValue }) => {
        this.setState({
            value: typeof newValue !== 'undefined' ? newValue : '',
        });
      };
  handleSelectJob  = (event ) => {
    this.setState({
        job: typeof event.target.value !== 'undefined' ? event.target.value : '',
    });
    this.props.setfunction(event.target.value)
          };

resetFormAfterSuccess =()=>{
  //this.props.dispatch(reset('fromWithStyles'));
}
handleChangeRegion  = (event) => {
      this.setState({
          region: typeof event.target.value !== 'undefined' ? event.target.value :''
      });
      this.props.setregion(event.target.value)
};

  handleChangeCity  = (event) => {
      let item = this.state.dataSource.filter(function (el) {
        return el.value == event.target.value
      });
       this.setState({
          CitySource :item[0].govs,
          city: typeof event.target.value !== 'undefined' ? event.target.value : ''
       });
       this.props.setcity(event.target.value)
};
render(){
  const { handleSubmit , classes} = this.props;
  //const errors = this.props.errors <= 0 ? null : this.renderErrors(this.props.errors);
  return (
    <div style={container}>
    <object type="image/svg+xml" data={BackAddUser} style={backgroundAddUser}/>
    <div style={whiteBackground}></div>
    <div style={subContainerAddUser}>
      <form onSubmit={handleSubmit} style={formAddUser}>
      <div className='containerTypoAvatar'>
        <Typography type="display1" gutterBottom style={titleAddUser}>
          إضافة مستخدم
        </Typography>
        <AvatarCropper
              av_photo = "avatar-photo"
              av_edit="avatar-edit"
              width = {400}
              height={400}
              setSuccessResponse={this.setSuccessResponse}/>
        </div>
        <Field name="identifiant" type="text" component={this.renderTextField} label=" الرقم " value="" style={styleSmallInput}/>
        <Field name="name" type="text" component={this.renderTextField} label=" الأسم " value="" style={styleinputForm}/>
        <Field name="forname" type="text" component={this.renderTextField} label=" اللقب " value="" style={styleinputForm}/>
        <Field name="cin" type="text" component={this.renderTextField} label=" رقم بطاقة التعريف الوطنية " style={styleSmallInput}/>
        <Field name="tel" type="" component={this.renderTextField} label=" الهاتف " style={styleSmallInput}/>
        <FormControl className={classes.formControl}  style={styleinputForm}>
            <Field name ="function" component={this.renderSelectField} label=" الصفة " value={this.state.job} style={styleinputForm}>
              {whatido.map(value => (
                <MenuItem
                  key={value.value}
                  value={value.label}
                >
                  {value.label}
                </MenuItem>
              ))}
            </Field>
        </FormControl>
        <Field component="input" name="avatar" type="hidden" value={this.state.avatar_file}/>
          <FormControl className={classes.formControl}  style={styleinputForm}>
            <InputLabel htmlFor="name-multiple">الولاية</InputLabel>
             <Select
               value={this.state.city}
               onChange={this.handleChangeCity}
               input={<Input id="name-multiple" />}
               MenuProps={{
                 PaperProps: {
                   style: {
                     maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                     width: 200,
                   },
                 },
               }}
             >
               {this.state.dataSource.map(city => (
                 <MenuItem
                   key={city.value}
                   value={city.value}
                 >
                   {city.label}
                 </MenuItem>
               ))}
             </Select>
          </FormControl>
          <FormControl className={classes.formControl}  style={styleinputForm}>
         <InputLabel htmlFor="name-multiple">المعتمدية</InputLabel>
          <Select
            value={this.state.region}
            onChange={this.handleChangeRegion}
            input={<Input id="name-multiple" />}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                  width: 200,
                },
              },
            }}
          >
            {this.state.CitySource.map(value => (
              <MenuItem
                key={value}
                value={value}
              >
                {value}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
          <Button  raised="true"type="submit" color="secondary" style={styleBottomForm}>
            حفظ المستخدم
           </Button>
      </form>

    </div>
  </div>

  );
}

}
const validate = (values) => {
  const errors = {}
  return errors;
}


const fromWithStyles = withStyles(styles)(AddUserFormComponent)
// Decorate the form component
export default reduxForm({
  form: 'AddUserFormComponent', // a unique name for this form
  validate
})(fromWithStyles);
