import React from 'react';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import {reset} from 'redux-form';
import { withStyles } from 'material-ui/styles';
import AddUserFormComponent from '../components/AdminSpace/AddUserFormComponent';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

const styles = (theme) => ({

    container:{
      backgroundColor: 'white',
    }
})
class AddUserFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] , user : null ,
    avatar_file : '',
    city :'',
    region :'',
    function : '',
    open: false
  };
  }

   setregion=(value)=>{
     this.setState({
       region : value
     });
   }
   setfunction=(value)=>{
     this.setState({
       function : value
     });
   }
   setcity=(value)=>{
     this.setState({
       city : value
     });
   }
   /**
    * Change the user object.
    *
    * @param {object} event - the JavaScript event object
    */
  handleSubmit(values) {
    values.avatar = this.state.avatar_file;
    values.region=this.state.region ;
    values.gouvernorat = this.state.city;
    values.fonction = this.state.function;
    this.props.mutate({ variables: values })
      .then((response) => {
        //this.formElement.resetFormAfterSuccess();
        this.handleClick();
      })
      .catch((err) => {
      });
  }
  setSuccessResponse =(value)=>{

    this.setState({
      avatar_file : value
    });
  }
  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const {classes} = this.props
    return (
      <div className={classes.container}>
        <Snackbar
       anchorOrigin={{
         vertical: 'bottom',
         horizontal: 'left',
       }}
       open={this.state.open}
       autoHideDuration={6000}
       onClose={this.handleClose}
       SnackbarContentProps={{
         'aria-describedby': 'message-id',
       }}
       message={<span id="message-id">Successfully Added</span>}
       action={[
         <IconButton
           key="close"
           aria-label="Close"
           color="inherit"
           //className={classes.close}
           onClick={this.handleClose}
         >
           <CloseIcon />
         </IconButton>,
       ]}
     />

      <AddUserFormComponent
        inputRef={el => this.formElement = el}
        setSuccessResponse = {this.setSuccessResponse}
        setcity={this.setcity}
        setfunction ={this.setfunction}
        setregion={this.setregion}
        onSubmit={this.handleSubmit.bind(this)}
        errors={this.state.errors}
      />   </div>
    );
  }
};

const addUserWithProfileMutation = gql`
  mutation addUserWithProfile($identifiant:String , $name: String!, $forname: String! , $tel:String! , $fonction:String! , $avatar:String , $cin:String! , $region:String , $gouvernorat:String) {
    addUserWithProfile(identifiant :$identifiant , name: $name, forname: $forname , tel :$tel , fonction :$fonction , avatar : $avatar , cin: $cin , region:$region , gouvernorat:$gouvernorat ) {
        _id
        username
    }
  }
`;

const AddUserFormContainerWithData = graphql(addUserWithProfileMutation)(withRouter(AddUserFormContainer));
export default withStyles(styles) (AddUserFormContainerWithData);
