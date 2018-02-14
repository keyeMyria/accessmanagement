import React from 'react';
import { Field, reduxForm } from 'redux-form';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import purple from 'material-ui/colors/purple';
import Button from 'material-ui/Button';

  const buttonLogin = {
    marginTop: '24px',
    width: '300px',
    color: '#00abc7',
    backgroundColor: '#fff',
    fontSize: '18px',
    fontFamily:'Changa',
    fontWeight:'300',
    };
    const formControl = {
      width: '300px',
      color: '#fff',
      margin:'8px',
      };

      const labelStyle ={
        color: '#fff',
      };
      const inputLabelFocused = {
        color: '#fff',
      };
const styles = theme => ({
  container: {
    width: '300px',
  },
  inputLabelFocused: {
    color: "#ffffff",
  },
  inputInkbar: {
    '&:after': {
      backgroundColor: "#ffffff",
    },
    '&:before': {
      backgroundColor: "#7B96C2",
    },
    '&:hover:not(.fake):before': {
        backgroundColor: "#ffffff",
    }
  },
  formLogin:{
    display: 'flex',
   'flexDirection': 'column',
  'justifyContent': 'center',
  'alignItems': 'center',
    minHeight: '200px',
  }

});
const style = {
  color: 'white',
  '&:after': {
    backgroundColor: "white"
  }
};

const renderErrors = (errors) => (
  <div className="alert alert-danger" role="alert">
    {errors.map((error, index) => <span key={index}>{error.value}</span>)}
  </div>
);
class SignInForm extends React.Component{
  renderHiddenField=({
    input,
    label,
    type
  })=>{
    return(<input type="hidden" {...input}/>)
  }
  renderTextField = ({
    input,
    label,
    type
  }) =>{
    return (

        <FormControl style={formControl}>
        <InputLabel
                  FormControlClasses={{
                    root : this.props.classes.inputLabelFocused,
                    focused: this.props.classes.inputLabelFocused
                  }}
                  htmlFor="custom-color-input"
                >
                  {label}
                </InputLabel>
        <Input
                  type={type}
                  {...input}
                   classes={{
                    inkbar: this.props.classes.inputInkbar
                    }}
        style={style}
       />

      </FormControl>
  );
}
  render(){
    const { handleSubmit , classes , username } = this.props;
    console.log(username)
    const errors = this.props.errors <= 0 ? null : renderErrors(this.props.errors);
    return (
        <form onSubmit={handleSubmit}
        className={classes.formLogin}
        >
          {errors}
          {(username!=null) &&(<Field name="username" type="username" component={this.renderHiddenField} classes={classes}  value={username} />)}
          {(username==null) &&(<Field name="username" type="username" component={this.renderTextField} classes={classes} label="اسم المستخدم" value="" />)}
          <Field name="password" type="password" component={this.renderTextField} label="كلمة  المرور" />
          <Button raised="true" type="submit" className="btn btn-primary" style={buttonLogin}> الدخول </Button>
        </form>
    );
  }
}


const validate = (values) => {
  const errors = {}

  if (!values.username) {
    errors.username = 'Required'
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length <= 3) {
    errors.password = 'Must be at least 4 characters';
  }

  return errors;
}

// Decorate the form component
const Reduxloginform= reduxForm({
  form: 'SignInForm', // a unique name for this form
  validate
})(SignInForm);
export default withStyles(styles)(Reduxloginform)
